//new tutuorial video page

"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { firestore } from "@/firebase"
import { query, collection, doc, getDocs, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { Button, Stack, Typography, Modal, TextField, Box } from '@mui/material';


export default function None() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState([""])
    const [itemQuantity, setItemQuantity] = useState(1)

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, "inventory"))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc) => {
            inventoryList.push({
                name: doc.id,
                ...doc.data(),
            })
        })
        setInventory(inventoryList)
    }

    const removeItem = async (item) => {
        item = item.charAt(0).toUpperCase() + item.slice(1)
        const docRef = doc(collection(firestore, "inventory"), item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()

            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                await setDoc(docRef, { quantity: quantity - 1 })
            }
        }
        await updateInventory()
    }

    const addItem = async (item) => {
        item = item.charAt(0).toUpperCase() + item.slice(1)
        const docRef = doc(collection(firestore, "inventory"), item)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            await setDoc(docRef, { quantity: quantity + itemQuantity })
        } else {
            await setDoc(docRef, { quantity: itemQuantity })
        }
        await updateInventory()
    }

    const editRecord = async (item, newName, newValue) => { /* used to be the add item function change it. add < 0 validation */
        item = item.charAt(0).toUpperCase() + item.slice(1)
        const docRef = doc(collection(firestore, "inventory"), item)
        const docSnap = await getDoc(docRef)

        if (value <= 0){
                console.log("item removed")
                alert(item," removed")
                removeItem(item)
        } else {
            
            if (docSnap.exists()) {
                const { quantity } = docSnap.data()
                await setDoc(docRef, { quantity: value })
            }
            await updateInventory()
            }
    }

    useEffect(() => {
        updateInventory()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClosed = () => setOpen(false)

    return (
        <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" gap={2} flexDirection="column">

            <Modal open={open} onClose={handleClosed}>
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{ transform: "translate(-50%, -50%)", }}
                    width={500}
                    bgcolor="white"
                    border="2px solid #000"
                    boxShadow={24}
                    p={4}
                    display={"flex"}
                    flexDirection="column"
                    gap={3}
                >
                    <Typography variant="h6">Add item's</Typography>
                    <Stack width="100%" direction="row" spacing={2}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Name"
                            id="outlined-basic"
                            value={itemName} 
                            onChange={(e) => {
                                setItemName(e.target.value)
                            }}
                        />
                        {/* add a quantity editor */}

                        <TextField id="outlined-number" label="Quantity" variant="outlined"
                        type="number" InputLabelProps={{shrink: true,}} 
                        InputProps={{ inputProps: { min: "1", step:"1"}}}
                        defaultValue={1} sx={{ width: '30%' }}
                        value={itemQuantity}
                        onChange={(e) => {
                            setItemQuantity(parseInt(e.target.value), 10)
                        }}
                        
                        />


          {/* id="outlined-error" */}

                        <Button
                            variant="outlined"
                            onClick={() => {
                                addItem(itemName.charAt(0).toUpperCase() + itemName.slice(1))
                                setItemName("")
                                setItemQuantity(1)
                                handleClosed()
                            }}
                        >Add</Button>
                    </Stack>

                </Box>

            </Modal>
            <Button variant="contained" onClick={() => {
                handleOpen()
            }}>
                Add Item's
            </Button>

            <Box border="1px solid #333">
                <Box
                    width="800px"
                    height="100px"
                    bgcolor="#ADD8E6"
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                >
                    <Typography variant="h2"
                        color="#333">Inventory Items
                    </Typography>
                </Box>

                <Stack width="800px" height="300px" spacing={2} overflow="auto">
                    {
                        inventory.map(({ name, quantity }) => (
                            <Box key={name} width="100%"
                                minHeight="150px"  display="flex"
                                alignItems="center" justifyContent="space-between"
                                backgroundColor="#f0f0f0" padding={5}>
                                <Typography variant="h3" color="#333" maxWidth="50%"
                                    textAlign="center" sx={{
                                        overflow: "hidden", textOverflow: "ellipsis",
                                        wordBreak:"break-word", whiteSpace:"nowrap"
                                    }}>
                                    {name.charAt(0).toUpperCase() + name.slice(1)}
                                </Typography>
                                <Typography variant="h3" color="#333"
                                    textAlign="center">{quantity}</Typography>

                                <Button variant="contained" onClick={() => {
                                    removeItem(name)
                                }}>Remove</Button>

                                <Button variant="contained" onClick={() => {
                                    editRecord(name, ) /* put here parameters */
                                }}>Edit</Button>

                            </Box>
                        ))}
                </Stack>
            </Box>
        </Box>
    )
}


/* features to add
    search option
    instead of the remove button, make it an option to append quantity - if quant = 0, then remove entry from db? have a save button so changes are only made to the db when save pressed
    when adding items, have a lil up and down arrow to set the quantity of what to add(append additem func to compensate for this by taking amount as a parameter)
    make frontend nicer and proffesional - search tiktok for nice frontends and use for inspo?
    deploy to vercel
    then include ai to scan items
    do bonus tasks



    curenrlty implelemnent a new handle for openeing a similar menu to old one
    make it so you can update a record. set quantity for original. 
    maybe make it same handle as the op but if a new name is in it, then it adds to db as new record. 
*/