//new tutuorial video page

"use client"
import Image from "next/image"
import {useState, useEffect} from "react"
import {firestore} from "@/firebase"

import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { query } from "firebase/firestore";

export default function None(){
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState([false])
    const [itemName, setItemName] = useState([""])

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, "inventory"))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach( (doc) => {
            inventoryList.push({
                name: doc.id,
                ...doc.data(),
            })
        })
        setInventory(inventoryList)
        console.log(inventoryList)
    }

    useEffect(() => {
        updateInventory()
    }, [])

    return (
        <Box>
            <Typography variant="h1">Inventory management</Typography>

            {
                inventory.forEach((item) => {
                    return (<>
                    {item.name}
                    {item.count}
                    </>)
                })
            }
        </Box>
    )
}