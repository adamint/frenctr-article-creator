import {ColorModeScript} from '@chakra-ui/react'
import NextDocument, {Head, Html, Main, NextScript} from 'next/document'

export default class Document extends NextDocument {
    render() {
        return (
            <Html lang='en'>
                <Head/>
                <body>
                {/* 👇 Here's the script */}
                <ColorModeScript/>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}
