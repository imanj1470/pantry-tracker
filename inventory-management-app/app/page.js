//new tutuorial video page

"use client"
import Image from "next/image"
import {useState, useEffect} from "react"
import {firestore} from "@/firebase"

import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';

export default function None(){
    return (
        <Box>
            <Typography variant="h1">Inventory management</Typography>
        </Box>
    )
}