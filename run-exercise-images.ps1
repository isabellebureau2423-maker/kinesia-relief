# ===== STEP 1: Setup =====
$src = "C:\Users\Polo Mistral\Desktop\image kinesia"
$dst = "C:\Users\Polo Mistral\Desktop\kinesia-app\.claude\worktrees\adoring-merkle-1dda14\public\exercises"

# Ensure destination exists
if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Force -Path $dst | Out-Null }

# ===== STEP 2: Delete all existing files in destination =====
Write-Host "Deleting existing files in destination..."
Get-ChildItem $dst -File | Remove-Item -Force -Confirm:$false
Write-Host "Destination cleared."

# ===== STEP 3: Slug function =====
function ConvertTo-Slug($text) {
    $s = $text.ToLower()
    # Remove accents
    $map = @{
        'e'=@('é','è','ê','ë'); 'a'=@('à','â','ä'); 'i'=@('î','ï');
        'o'=@('ô','ö'); 'u'=@('ù','û','ü'); 'c'=@('ç')
    }
    foreach ($repl in $map.Keys) {
        foreach ($ch in $map[$repl]) { $s = $s.Replace($ch, $repl) }
    }
    # Replace non a-z 0-9 space with space
    $s = [regex]::Replace($s, '[^a-z0-9 ]', ' ')
    # Trim and collapse spaces to hyphens
    $s = ($s.Trim() -replace '\s+', '-')
    return $s
}

# ===== STEP 4: Build image slug map =====
Write-Host "Building image slug map..."
$imageFiles = Get-ChildItem $src -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg)$' }
$imageSlugMap = @{} # slug -> file object (keep longest/most descriptive)

foreach ($img in $imageFiles) {
    $nameNoExt = [System.IO.Path]::GetFileNameWithoutExtension($img.Name)
    $slug = ConvertTo-Slug $nameNoExt
    # Only add if not already present (first one wins, or longer slug wins)
    if (-not $imageSlugMap.ContainsKey($slug)) {
        $imageSlugMap[$slug] = $img
    }
}
Write-Host "Total unique image slugs: $($imageSlugMap.Count)"

# ===== STEP 5: Exercise list =====
$exercises = @(
    "Abduction hanche debout D","Abduction hanche debout G","Activation rhomboïdes",
    "Alphabet cheville D","Alphabet cheville G","Balle contre mur dos",
    "Balle contre mur omoplate D","Balle contre mur omoplate G","Balle de tennis pied D",
    "Balle de tennis pied G","Balle de tennis trapèze","Balle fessier D","Balle fessier droit",
    "Balle fessier G","Balle fessier gauche","Balle ischio droite","Balle ischio gauche",
    "Balle pectoral contre mur D","Balle pectoral contre mur G","Balles paires lombaires",
    "Bird-dog","Cercles de poignet D","Cercles de poignet G","Compression points trigger",
    "Compression trapèze D","Compression trapèze droit","Compression trapèze G",
    "Compression trapèze gauche","Coquillage D","Coquillage G","Curl biceps D","Curl biceps G",
    "Curl excentrique D","Curl excentrique G","Curl ischio debout D","Curl ischio debout G",
    "Dips chaise D","Dips chaise G","Donkey kick droit","Donkey kick gauche",
    "Écartement orteils D","Écartement orteils G","Étirement avant-bras droit",
    "Étirement avant-bras gauche","Étirement biceps D","Étirement biceps G",
    "Étirement biceps mur D","Étirement biceps mur G","Étirement chat-vache","Étirement cobra",
    "Étirement dos main D","Étirement dos main G","Étirement épaule croisé D",
    "Étirement épaule croisé G","Étirement extenseurs avant-bras D",
    "Étirement extenseurs avant-bras G","Étirement extenseurs doigts D",
    "Étirement extenseurs doigts G","Étirement extenseurs droits","Étirement extenseurs gauches",
    "Étirement extenseurs orteils D","Étirement extenseurs orteils G",
    "Étirement fascia plantaire D","Étirement fascia plantaire G",
    "Étirement fessier assis D","Étirement fessier assis G",
    "Étirement fléchisseur de hanche","Étirement fléchisseur hanche D",
    "Étirement fléchisseur hanche G","Étirement fléchisseurs avant-bras D",
    "Étirement fléchisseurs avant-bras G","Étirement fléchisseurs doigts D",
    "Étirement fléchisseurs doigts G","Étirement gastrocnémien D","Étirement gastrocnémien G",
    "Étirement ischio D","Étirement ischio G","Étirement ischio-jambier D allongé",
    "Étirement ischio-jambier G allongé","Étirement latéral cervical","Étirement mollet D",
    "Étirement mollet D au mur","Étirement mollet G","Étirement mollet G au mur",
    "Étirement orteils D","Étirement orteils G","Étirement paume D","Étirement paume G",
    "Étirement pectoral bras tendu D","Étirement pectoral bras tendu G",
    "Étirement pectoral cadre de porte D","Étirement pectoral cadre de porte G",
    "Étirement piriforme","Étirement piriforme D","Étirement piriforme droit",
    "Étirement piriforme G","Étirement piriforme gauche",
    "Étirement poignet droit extenseurs","Étirement poignet droit fléchisseurs",
    "Étirement poignet gauche extenseurs","Étirement poignet gauche fléchisseurs",
    "Étirement quadriceps D","Étirement quadriceps D debout","Étirement quadriceps G",
    "Étirement quadriceps G debout","Étirement rhomboïde D","Étirement rhomboïde G",
    "Étirement soléaire D","Étirement soléaire G","Étirement sous-occipital",
    "Étirement tendon Achille D","Étirement tendon Achille G","Étirement tibial D",
    "Étirement tibial G","Étirement trapèze supérieur","Étirement trapèze supérieur D",
    "Étirement trapèze supérieur G","Étirement triceps croisé D","Étirement triceps croisé G",
    "Étirement voûte plantaire D","Étirement voûte plantaire G","Extension doigts D",
    "Extension doigts G","Extension dorsale","Extension genou assis D","Extension genou assis G",
    "Extension triceps D","Extension triceps G","Fente étirante droite","Fente étirante gauche",
    "Flexion avant debout D","Flexion avant debout G","Flexion cervicale",
    "Flexion cervicale douce","Flexion dorsale cheville D","Flexion dorsale cheville G",
    "Flexion genou actif D","Flexion genou actif G","Flexion latérale debout",
    "Flexion lombaire debout","Flexion-extension poignet D","Flexion-extension poignet G",
    "Friction articulations D","Friction articulations G","Friction articulations orteils D",
    "Friction articulations orteils G","Friction biceps D","Friction biceps G",
    "Friction circulaire épaule D","Friction circulaire épaule G","Friction coude latéral D",
    "Friction coude latéral G","Friction coude postérieur D","Friction coude postérieur G",
    "Friction creux poplité D","Friction creux poplité G","Friction cuir chevelu",
    "Friction dessus pied D","Friction dessus pied G","Friction dos main D","Friction dos main G",
    "Friction fessière droite","Friction fessière gauche","Friction paume D","Friction paume G",
    "Friction poignet droit","Friction poignet gauche","Friction rotule droite",
    "Friction rotule gauche","Friction talon droit","Friction talon gauche",
    "Friction tendon Achille D","Friction tendon Achille G","Friction tendons extenseurs D",
    "Friction tendons extenseurs G","Friction tibia droit","Friction tibia gauche",
    "Friction voûte plantaire D","Friction voûte plantaire G","Genoux-poitrine",
    "Glace après effort D","Glace après effort G","Glace talon droit","Glace talon gauche",
    "Good morning","Haussements d'épaules","Inclinaison pelvienne","Marche sur la pointe D",
    "Marche sur la pointe G","Marche sur les talons","Marche sur les talons D",
    "Marche sur les talons G","Massage abdominal circulaire","Massage avant-bras D",
    "Massage avant-bras G","Massage bas-ventre doux","Massage cheville D circulaire",
    "Massage cheville G circulaire","Mini squat D","Mini squat G","Mobilisation doigts D",
    "Mobilisation doigts G","Montée de marche D","Montée de marche G","Opposition pouce D",
    "Opposition pouce G","Ouverture thoracique","Pétrissage avant-bras D",
    "Pétrissage avant-bras G","Pétrissage biceps D","Pétrissage biceps G",
    "Pétrissage cuisse D","Pétrissage cuisse G","Pétrissage mollet D","Pétrissage mollet G",
    "Pétrissage nuque","Pétrissage thénar D","Pétrissage thénar G","Pétrissage triceps D",
    "Pétrissage triceps G","Pont fessier","Pont fessier unilatéral D",
    "Pont fessier unilatéral G","Préhension balle D","Préhension balle G",
    "Préhension orteils D","Préhension orteils G","Pression base du crâne",
    "Pression points dessus pied D","Pression points dessus pied G",
    "Pression points genou D","Pression points genou G","Pression pouces lombaires",
    "Relevé de talon bilatéral","Relevé de talon D","Relevé de talon D unilatéral",
    "Relevé de talon G","Relevé de talon G unilatéral","Relevé excentrique D",
    "Relevé excentrique G","Relevé orteils D","Relevé orteils G",
    "Respiration diaphragmatique","Rétraction du menton","Rétraction scapulaire",
    "Rotation avant-bras D","Rotation avant-bras G","Rotation d'épaule","Rotation du cou",
    "Rotation interne épaule D","Rotation interne épaule G","Rotation thoracique",
    "Rouleau base du crâne","Rouleau mousse bas du dos","Rouleau mousse cuisse D",
    "Rouleau mousse cuisse G","Rouleau mousse dos","Rouleau mousse hanche D",
    "Rouleau mousse hanche G","Rouleau mousse ischio D","Rouleau mousse ischio G",
    "Rouleau mousse lombaires","Rouleau mousse mollet D","Rouleau mousse mollet G",
    "Rowing horizontal","Serrage balle anti-stress D","Serrage balle anti-stress G",
    "Serrage balle douce D","Serrage balle douce G","Squat partiel","Superman",
    "Torsion dorsale allongé","Traction doigts D","Traction doigts G",
    "Traction orteils D","Traction orteils G"
)

# ===== STEP 6: Match and copy =====
Write-Host "Matching exercises to images..."
$matched = @()
$unmatched = @()
$imageSlugKeys = $imageSlugMap.Keys | Sort-Object { $_.Length } -Descending

foreach ($exercise in $exercises) {
    $exSlug = ConvertTo-Slug $exercise
    $bestMatch = $null
    $bestLen = -1

    # Pass 1: exact match
    if ($imageSlugMap.ContainsKey($exSlug)) {
        $bestMatch = $exSlug
        $bestLen = $exSlug.Length
    }

    # Pass 2: exercise slug starts with imageSlug + "-"
    if (-not $bestMatch) {
        foreach ($imgSlug in $imageSlugKeys) {
            if ($exSlug.StartsWith($imgSlug + "-") -and $imgSlug.Length -gt $bestLen) {
                $bestMatch = $imgSlug
                $bestLen = $imgSlug.Length
            }
        }
    }

    # Pass 3: image slug contains most words of exercise slug
    if (-not $bestMatch) {
        $exWords = $exSlug -split '-' | Where-Object { $_.Length -gt 2 }
        if ($exWords.Count -gt 0) {
            foreach ($imgSlug in $imageSlugKeys) {
                $imgWords = $imgSlug -split '-'
                $hits = ($exWords | Where-Object { $imgWords -contains $_ }).Count
                $ratio = $hits / $exWords.Count
                if ($ratio -ge 0.6 -and $imgSlug.Length -gt $bestLen) {
                    $bestMatch = $imgSlug
                    $bestLen = $imgSlug.Length
                }
            }
        }
    }

    if ($bestMatch) {
        $srcFile = $imageSlugMap[$bestMatch]
        $dstFile = Join-Path $dst ($exSlug + ".jpg")
        Copy-Item -Path $srcFile.FullName -Destination $dstFile -Force
        $matched += [PSCustomObject]@{ Exercise=$exercise; ExSlug=$exSlug; ImageSlug=$bestMatch; SrcFile=$srcFile.Name }
        Write-Host "  MATCH: '$exercise' -> '$bestMatch'" -ForegroundColor Green
    } else {
        $unmatched += $exercise
        Write-Host "  NO MATCH: '$exercise' ($exSlug)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "===== MATCHING SUMMARY =====" -ForegroundColor Cyan
Write-Host "Matched: $($matched.Count) / $($exercises.Count)"
Write-Host "Unmatched: $($unmatched.Count)"

# ===== STEP 7: Brightness analysis - delete light-background images =====
Write-Host ""
Write-Host "===== BRIGHTNESS ANALYSIS =====" -ForegroundColor Cyan

Add-Type -AssemblyName System.Drawing

$deletedBright = @()
$copiedFiles = Get-ChildItem $dst -File -Filter "*.jpg"

foreach ($file in $copiedFiles) {
    try {
        $bmp = [System.Drawing.Bitmap]::FromFile($file.FullName)
        $w = $bmp.Width
        $h = $bmp.Height
        
        # Sample corners + center (5 points)
        $samplePoints = @(
            @(10, 10), @($w-10, 10), @(10, $h-10), @($w-10, $h-10), @($w/2, $h/2)
        )
        
        $totalBrightness = 0
        $count = 0
        foreach ($pt in $samplePoints) {
            $px = [int]$pt[0]; $py = [int]$pt[1]
            if ($px -ge 0 -and $px -lt $w -and $py -ge 0 -and $py -lt $h) {
                $color = $bmp.GetPixel($px, $py)
                $brightness = ($color.R + $color.G + $color.B) / 3
                $totalBrightness += $brightness
                $count++
            }
        }
        $bmp.Dispose()
        
        $avgBrightness = if ($count -gt 0) { $totalBrightness / $count } else { 0 }
        
        if ($avgBrightness -gt 130) {
            Write-Host "  DELETE (bright=$([math]::Round($avgBrightness,1))): $($file.Name)" -ForegroundColor Red
            Remove-Item $file.FullName -Force -Confirm:$false
            $deletedBright += $file.Name
        }
    } catch {
        Write-Host "  ERROR reading $($file.Name): $_" -ForegroundColor Magenta
        if ($bmp) { $bmp.Dispose() }
    }
}

Write-Host ""
Write-Host "===== FINAL RESULTS =====" -ForegroundColor Cyan
$finalCount = (Get-ChildItem $dst -File -Filter "*.jpg" | Measure-Object).Count
Write-Host "Exercises with images (after brightness filter): $finalCount"
Write-Host "Exercises without images: $($unmatched.Count)"
Write-Host "Images deleted (light background): $($deletedBright.Count)"
Write-Host ""
Write-Host "UNMATCHED EXERCISES:" -ForegroundColor Yellow
$unmatched | ForEach-Object { Write-Host "  - $_" }
Write-Host ""
Write-Host "DELETED (bright background):" -ForegroundColor Red
$deletedBright | ForEach-Object { Write-Host "  - $_" }
