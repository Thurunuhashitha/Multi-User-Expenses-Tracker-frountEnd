import React, { useState } from 'react'
import Button from '../../Component/button/button'
import './registerStyle.css'
import Input from '../../Component/input/input'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegister = async () => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/auth/register',
                formData
            )

            alert(res.data.message)
            navigate('/login')

        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed')
        }
    }

    return (
        <Box className='main'>
            <Box className='form'>
                <h1>Register Page</h1>

                <Input
                    label="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                />

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
                    text="Register"
                    onClick={handleRegister}
                />
            </Box>
        </Box>
    )
}
