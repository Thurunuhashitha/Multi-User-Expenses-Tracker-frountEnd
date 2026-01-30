import React, { useState } from 'react'
import './loginStyle.css'
import Box from '@mui/material/Box'
import Input from '../../Component/input/input'
import Button from '../../Component/button/button'
import {useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/auth/login',
                formData
            )

            // save token
            localStorage.setItem('token', res.data.token)

            alert('Login successful')
            navigate('/expenses') // or dashboard

        } catch (err) {
            alert(err.response?.data?.error || 'Login failed')
        }
    }

    return (
        <Box className='main'>
            <Box className='form'>
                <h1>Login Page</h1>

                <Input
                    label="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <Input
                    label="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <Button
                    className='button'
                    text="Login"
                    onClick={handleLogin}
                />
 
            </Box>
        </Box>
    )
}
