import React from 'react'
import Button from '../../Component/button/button'
import './registerStyle.css'
import Input from '../../Component/input/input'
import Box from '@mui/material/Box'
import { Link } from 'react-router-dom'

export default function Register() {

    return (
        <Box className='main'>
            <Box className='form'>
                <h1>Register Page</h1>
                <Input
                    label="name"
                    type="text"
                />
                <Input
                    label="address"
                    type="text"
                />
                <Input
                    label="email"
                    type="email"
                />
                <Input
                    label="password"
                    type="password"
                />
                <Box >
                    <Link to="/login">
                        <Button className='button'
                            text="Cleck me to Login"
                        />
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}
