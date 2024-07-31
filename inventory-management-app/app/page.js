import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';

const item = [
  "orange",
  "tomato",
  "carrot",
  "banana",
  "apple",
  "pear",
  "mango",
  "kiwi",
  "melon",
  "watermelon",
  "radish",
  "potato"
]

export default function Home() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"Center"}
    >
      <Box width="800px" height="100px" bgcolor={"#f0f0f0"}>
        <Typography
          Kitchen items
    </Box>

      <Stack width="800px" height="200px" spacing={2} overflow={"auto"}>
        {item.map((i) => (
          <Box
            key={i}
            width="100%"
            height="300px"
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            bgcolor={"#f0f0f0"}/* white */
          >
            <Typography
              variant={"h3"} color={"#333"} 
              textAlign={"center"} fontWeight={111}
            >
              {
                i.charAt(0).toUpperCase() + i.slice(1)
              }
            </Typography>

          </Box>

        ))}

      </Stack>
    </Box>
  )
}
