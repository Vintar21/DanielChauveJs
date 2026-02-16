# First template
# TODO check what is exactly needed with npm install
# npm install
# npm install discord.js

# Because of type-fest module, there is an ExcessiveStackDeepError while building, we can just ignore it
function removeExcessiveStackDeepError {

    param (
        $filePath,
        $lineNumbers
    )
    $textToAdd = "> = `r`n// @ts-ignore`r`n["

    $fileContent = Get-Content $filePath

    foreach ($lineNumber in $lineNumbers) {
        $lineContent = $fileContent[$lineNumber-1]
        $lineContent = $lineContent -replace "\[", "`r`n// @ts-ignore`r`n["
        $fileContent[$lineNumber-1] = $lineContent  
    }
    $fileContent | Set-Content $filePath
}

$filePath = "node_modules/type-fest/source/merge-deep.d.ts"
# Start by the last lines first to not compromise the line numbers of the next edits
removeExcessiveStackDeepError -filePath $filePath -lineNumbers 192, 166, 140

