import {Button, useColorMode} from "@chakra-ui/react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";

export function ColorModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <header>
            <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
            </Button>
        </header>
    )
}