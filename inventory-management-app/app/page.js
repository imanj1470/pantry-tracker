//new tutuorial video page

"use client"
import Image from "next/image"
import {useState, useEffect} from "react"
import {firestore} from "@/firebase"

import { Button, Stack, Typography, Modal, TextField, Box } from '@mui/material';
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
                await setDoc(docRef, {quantity: quantity - 1})
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
        <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" gap={2}>

            <Modal open={open} onClose={handleClosed}>
                <Box 
                position="absolute"
                top="50%"
                left = "50%"
                sx={{transform: "translate(-50%, -50%)",}}
                width={500}
                bgcolor="white"
                border="2px solid #000"
                boxShadow={24}
                p={4}
                display={"flex"}
                flexDirection="column"
                gap={3}
                >
                    <Typography variant="h6">Add Item</Typography>
                    <Stack width="100%" direction="row" spacing={2}>
                        <TextField 
                        variant="outlined"
                        fullWidth
                        value={itemName}
                        onChange={(e) => {
                            setItemName(e.target.value)
                        }}
                        />

                        <Button
                        variant="outlined"
                        onClick={() => {
                            addItem(itemName)
                            setItemName("")
                            handleClosed()
                        }}
                        >Add</Button>
                    </Stack>

                </Box>

            </Modal>
            <Button variant="contained" onClick={() => {
                handleOpen()
            }}>
                Add new item
            </Button>
            
        {/* <Typography variant="h1">Inventory management</Typography> */}

            
        </Box>
    )
}