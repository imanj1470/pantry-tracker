//new tutuorial video page

"use client"
import Image from "next/image"
import {useState, useEffect} from "react"
import {firestore} from "@/firebase"

import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { query, collection, getDocs, getDoc, deleteDoc } from "firebase/firestore";

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

    }

    const removeItem = async(item) => {
        const docRef = doc(collection(firestore, "inventory"), item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()){
            const {quantity} = docSnap.data()

            if (quantity === 1){
                await deleteDoc(docRef)
            } else{
                await setDoc(docRef, {quantity: quantity = 1})
            }
        }
        await updateInventory()
    }

    const addItem = async(item) => {
        const docRef = doc(collection(firestore, "inventory"), item)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
            const {quantity} = docSnap.data()

            await setDoc(docRef, {quantity: quantity + 1})
        } else{
            await setDoc(docRef, {quantity: 1})
        }
        await updateInventory()
    }

    useEffect(() => {
        updateInventory()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClosed = () => setOpen(false)

    return (
        <Box>
            <Typography variant="h1">Inventory management</Typography>
            
        </Box>
    )
}