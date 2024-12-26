@echo off
:: Paths to repo and dev folders
set BEHAVIOR_PACK=C:\Users\lutho\Documents\GitHub\Resination\behaviours
set RESOURCE_PACK=C:\Users\lutho\Documents\GitHub\Resination\resources
set MINECRAFT_BEHAVIOR_PACK=C:\Users\lutho\Documents\Software\MCBESwitcher+\Profiles\Lufurrius\development_behavior_packs\Resination
set MINECRAFT_RESOURCE_PACK=C:\Users\lutho\Documents\Software\MCBESwitcher+\Profiles\Lufurrius\development_resource_packs\Resination

:: Copy and mirror packs
robocopy "%BEHAVIOR_PACK%" "%MINECRAFT_BEHAVIOR_PACK%" /MIR
robocopy "%RESOURCE_PACK%" "%MINECRAFT_RESOURCE_PACK%" /MIR

echo Sync complete!