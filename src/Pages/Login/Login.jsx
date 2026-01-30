import React from 'react'
import './loginStyle.css'
import Box from '@mui/material/Box'
import Input from '../../Component/input/input'
import Button from '../../Component/button/button'
import { Link } from 'react-router-dom'

export default function Login() {
    return (
        <Box className='main'>
            <Box className='form'>
                <h1>Login Page</h1>
                <Input
                    label="email"
                    type="email"
                />
                <Input
                    label="password"
                    type="password"
                />
                <Link to="/register">
                    <Button className='button'
                        text="Cleck me to Register"
                    />
                </Link>
            </Box>
        </Box>
    )
}
