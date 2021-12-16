import Head from 'next/head'
import {Alert, AlertIcon, Box, Button, Heading, HStack, Text} from "@chakra-ui/react";
import {useDropzone} from 'react-dropzone';
import {ColorModeToggle} from "../utils/ColorModeToggle";
import {useEffect, useMemo, useState} from "react";
import {convertFacultyToXml, FacultyMember} from "../utils/FacultyMember";
import copy from "copy-to-clipboard";
import exp from "constants";

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: "column" as "column",
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

export default function Home() {
    const {acceptedFiles, getRootProps, getInputProps, isDragAccept, isDragActive, isDragReject} = useDropzone({
        accept: "application/json"
    });

    const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember[] | null>(null)
    useEffect(() => {
        (async () => {
            if (acceptedFiles.length === 0) setSelectedFaculty(null)
            else {
                const rawText = (stripNonValidXml(await acceptedFiles[0].text()) as string)
                setSelectedFaculty(JSON.parse(rawText))
            }
        })()
    }, [acceptedFiles])

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    return <>
        <Head>
            <title>frenctr faculty article creator</title>
        </Head>

        <Box mx="auto" w="67%" my={10}>
            <HStack>
                <Heading size="lg">frenctr faculty article creator </Heading>
                <ColorModeToggle/>
            </HStack>
            <Alert status='info' mt={3}>
                <AlertIcon/>
                Remember, each individual entry must be enclosed in {"{}"} and contain the following fields:
                name, school, title

                <br/>
                The following fields are optional:
                profilePictureUrl, linkToProfile (link to the IU profile page for faculty member), email, phoneNumber,
                office
            </Alert>

            <Box my={5}>
                <Text mb={3}>To begin, please select the JSON file to use</Text>
                <section className="container">
                    <div {...getRootProps({style})}>
                        <input {...getInputProps()} />
                        <Text>Drag and drop, or click here to select JSON file</Text>
                    </div>
                </section>
                {selectedFaculty && <Box>
                    <Text>Your file contains {selectedFaculty.length} faculty</Text>
                </Box>}
            </Box>

            {selectedFaculty && <Box>
                <Heading size="md">Generated article tags:</Heading>
                <Alert status='info' mt={3} mb={10}>
                    <AlertIcon/>
                    <Text>Paste this in the <b>third</b> code chunk on the faculty page.</Text>
                </Alert>

                <Button onClick={() => copy(convertFacultyToXml(selectedFaculty))}>Click to copy</Button>
            </Box>}
        </Box>

    </>
}


export function stripNonValidXml(input) {
    if (!input) return input
    let output = ""
    input.split('').forEach(character => {
        const charCode = character.charCodeAt(0)
        if (charCode === 0x9 || charCode === 0xA ||
            charCode === 0xD ||
            charCode >= 0x20 && charCode <= 0xD7FF ||
            charCode >= 0xE000 && charCode <= 0xFFFD ||
            charCode >= 0x10000 && charCode <= 0x10FFFF) output += character
    })

    return output
}