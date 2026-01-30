import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '../../Component/button/button'
import Input from '../../Component/input/input'
import axios from 'axios'
import './expensesStyle.css'

export default function Expenses() {

    const [expenses, setExpenses] = useState([])
    const [formData, setFormData] = useState({
        reason: '',
        amount: '',
        date: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // 🔹 GET ALL EXPENSES
    const getAllExpenses = async () => {
        try {
            const res = await axios.get(
                'http://localhost:3000/api/expenses/all',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            setExpenses(res.data)
        } catch (err) {
            alert('Failed to fetch expenses')
        }
    }

    // 🔹 CREATE EXPENSE
    const createExpense = async () => {
        try {
            await axios.post(
                'http://localhost:3000/api/expenses/add',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            alert('Expense added')
            getAllExpenses() // refresh list
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add expense')
        }
    }

    return (
        <Box className="expenses-main">
            <h1>Expenses Page</h1>

            {/* CREATE EXPENSE */}
            <Box className="expense-form">
                <Input
                    label="Reason"
                    name="reason"
                    type="text"
                    value={formData.reason}
                    onChange={handleChange}
                />

                <Input
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                />

                <Input
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                />

                <Button
                    className="button"
                    text="Create Expense"
                    onClick={createExpense}
                />
            </Box>

            {/* GET ALL */}
            <Button
                className="button"
                text="Get All Expenses"
                onClick={getAllExpenses}
            />

            {/* EXPENSE LIST */}
            <Box className="expense-list">
                {expenses.map((exp, index) => (
                    <Box key={index} className="expense-item">
                        <p><b>Reason:</b> {exp.reason}</p>
                        <p><b>Amount:</b> {exp.amount}</p>
                        <p><b>Date:</b> {exp.date}</p>
                        <hr />
                    </Box>
                ))}
            </Box>
        </Box>
    )
}
