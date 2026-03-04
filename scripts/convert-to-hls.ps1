# HLS Multi-Quality Video Converter
# Bu script barcha MP4 videolarni HLS formatga convert qiladi
# Har bir video 3 ta sifat: 720p, 480p, 360p

param(
    [string]$InputDir = "f:\Project\bussells\public\videos",
    [string]$OutputDir = "f:\Project\bussells\public\videos\hls"
)

# Output papkani yaratish
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Barcha MP4 fayllarni olish
$videos = Get-ChildItem -Path $InputDir -Filter "*.mp4" -File

foreach ($video in $videos) {
    $name = [System.IO.Path]::GetFileNameWithoutExtension($video.Name)
    # Fayl nomidagi bo'sh joylarni tire bilan almashtirish
    $safeName = $name -replace '\s+', '-'
    $videoOutDir = Join-Path $OutputDir $safeName

    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Converting: $($video.Name) -> $safeName" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan

    # Har bir video uchun papka yaratish
    if (!(Test-Path $videoOutDir)) {
        New-Item -ItemType Directory -Path $videoOutDir -Force | Out-Null
    }

    # Video resolution ni aniqlash
    $probeOutput = & ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 $video.FullName 2>&1
    $dimensions = $probeOutput -split ","
    $srcWidth = [int]$dimensions[0]
    $srcHeight = [int]$dimensions[1]

    Write-Host "Original resolution: ${srcWidth}x${srcHeight}"

    # Sifat darajalari — faqat manba resolutiondan kichikroqlarini ishlatamiz
    # Vertical video bo'lsa width bo'yicha, horizontal bo'lsa height bo'yicha
    $maxDim = [Math]::Max($srcWidth, $srcHeight)

    $qualities = @()

    if ($maxDim -ge 720) {
        $qualities += @{ name = "720p"; height = 720; videoBitrate = "2000k"; audioBitrate = "128k"; maxrate = "2500k"; bufsize = "4000k" }
    }
    if ($maxDim -ge 480) {
        $qualities += @{ name = "480p"; height = 480; videoBitrate = "1000k"; audioBitrate = "96k"; maxrate = "1200k"; bufsize = "2000k" }
    }
    $qualities += @{ name = "360p"; height = 360; videoBitrate = "600k"; audioBitrate = "64k"; maxrate = "800k"; bufsize = "1200k" }

    $variantEntries = @()

    foreach ($q in $qualities) {
        $qName = $q.name
        $qDir = Join-Path $videoOutDir $qName

        if (!(Test-Path $qDir)) {
            New-Item -ItemType Directory -Path $qDir -Force | Out-Null
        }

        $outputPath = Join-Path $qDir "stream.m3u8"

        Write-Host "  -> $qName (height=$($q.height), bitrate=$($q.videoBitrate))..." -NoNewline

        # FFmpeg bilan HLS segment yaratish
        # scale=-2:height — aspect ratio saqlanadi, width juft son bo'ladi
        & ffmpeg -y -i $video.FullName `
            -vf "scale=-2:$($q.height)" `
            -c:v libx264 -preset fast -crf 23 `
            -b:v $q.videoBitrate -maxrate $q.maxrate -bufsize $q.bufsize `
            -c:a aac -b:a $q.audioBitrate `
            -hls_time 4 `
            -hls_list_size 0 `
            -hls_segment_filename (Join-Path $qDir "segment_%03d.ts") `
            -f hls `
            $outputPath 2>&1 | Out-Null

        if ($LASTEXITCODE -eq 0) {
            Write-Host " OK" -ForegroundColor Green
        } else {
            Write-Host " XATO!" -ForegroundColor Red
        }

        # Bandwidth hisoblash (bitrate -> bits/sec)
        $bwNum = [int]($q.videoBitrate -replace 'k','') * 1000
        $abwNum = [int]($q.audioBitrate -replace 'k','') * 1000
        $totalBw = $bwNum + $abwNum

        # Aspect ratio bo'yicha width hisoblash
        if ($srcWidth -gt $srcHeight) {
            # Horizontal video
            $outHeight = $q.height
            $outWidth = [Math]::Round($srcWidth * $outHeight / $srcHeight / 2) * 2
        } else {
            # Vertical video
            $outHeight = $q.height
            $outWidth = [Math]::Round($srcWidth * $outHeight / $srcHeight / 2) * 2
        }

        $variantEntries += "#EXT-X-STREAM-INF:BANDWIDTH=$totalBw,RESOLUTION=${outWidth}x${outHeight},NAME=`"$qName`""
        $variantEntries += "$qName/stream.m3u8"
    }

    # Master playlist yaratish
    $masterContent = "#EXTM3U`n#EXT-X-VERSION:3`n"
    $masterContent += ($variantEntries -join "`n")
    $masterPlaylist = Join-Path $videoOutDir "master.m3u8"
    Set-Content -Path $masterPlaylist -Value $masterContent -Encoding UTF8

    Write-Host "`nMaster playlist yaratildi: $masterPlaylist" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "HAMMASI TAYYOR!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HLS fayllar: $OutputDir"
Write-Host ""
Write-Host "Seed.js dagi videoUrl ni o'zgartiring:" -ForegroundColor Yellow
Write-Host "  '/videos/Registan.mp4'  ->  '/videos/hls/Registan/master.m3u8'"
