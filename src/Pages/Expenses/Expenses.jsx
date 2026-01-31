import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '../../Component/button/button'
import Input from '../../Component/input/input'
import axios from 'axios'
import './expensesStyle.css'

export default function Expenses() {

    const [expenses, setExpenses] = useState([])
    const [activeView, setActiveView] = useState('') // create | all | search
    const [searchDate, setSearchDate] = useState('')
    const [hasSearched, setHasSearched] = useState(false)

    const [billImg, setBillImg] = useState(null)

    const [formData, setFormData] = useState({
        reason: '',
        amount: '',
        date: ''
    })

    // ================= HANDLE INPUT =================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e) => {
        setBillImg(e.target.files[0])
    }

    // ================= GET ALL =================
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
            setActiveView('all')
        } catch {
            alert('Failed to fetch expenses')
        }
    }

    // ================= CREATE =================
    const createExpense = async () => {
        try {
            const data = new FormData()
            data.append('reason', formData.reason)
            data.append('amount', formData.amount)
            data.append('date', formData.date)

            if (billImg) {
                data.append('bill_img', billImg)
            }

            await axios.post(
                'http://localhost:3000/api/expenses/add',
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            alert('Expense added successfully')
            setFormData({ reason: '', amount: '', date: '' })
            setBillImg(null)

        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add expense')
        }
    }

    // ================= SEARCH BY DATE =================
    const searchByDate = async () => {
        if (!searchDate) {
            alert('Please select a date')
            return
        }

        setHasSearched(true)

        try {
            const res = await axios.get(
                `http://localhost:3000/api/expenses/search?date=${searchDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            const normalized = res.data.map(exp => ({
                ...exp,
                date: new Date(exp.date).toISOString().split('T')[0]
            }))

            setExpenses(normalized)
            setActiveView('search')

        } catch {
            const allExpenses = await axios.get(
                'http://localhost:3000/api/expenses/all',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            const filtered = allExpenses.data.filter(exp => {
                const expDate = new Date(exp.date).toISOString().split('T')[0]
                return expDate === searchDate
            })

            setExpenses(filtered)
            setActiveView('search')
        }
    }

    // ================= UI =================
    return (
        <Box>

            {/* NAVBAR */}
            <Box className='nav' sx={{ display: 'flex', gap: 2, padding: 2, justifyContent: 'center' }}>
                <Button text="Create Expense" onClick={() => setActiveView('create')} />
                <Button text="Show All Expenses" onClick={getAllExpenses} />
                <Button
                    text="Search by Date"
                    onClick={() => {
                        setActiveView('search')
                        setHasSearched(false)
                        setExpenses([])
                    }}
                />
            </Box>

            <Box className="expenses-main">

                {/* CREATE */}
                {activeView === 'create' && (
                    <Box className="expense-form">
                        <h2>Create New Expense</h2>

                        <Input label="Reason" name="reason" value={formData.reason} onChange={handleChange} />
                        <Input label="Amount" type="number" name="amount" value={formData.amount} onChange={handleChange} />
                        <Input type="date" name="date" value={formData.date} onChange={handleChange} />

                        <Input type="file" accept="image/*" onChange={handleFileChange} />

                        {billImg && (
                            <img
                                src={URL.createObjectURL(billImg)}
                                alt="Bill Preview"
                                style={{ width: '150px', marginTop: '10px' }}
                            />
                        )}

                        <Button text="Add Expense" onClick={createExpense} />
                    </Box>
                )}

                {/* SEARCH */}
                {activeView === 'search' && (
                    <Box className="search-section">
                        <h2>Search Expenses by Date</h2>

                        <Input
                            type="date"
                            value={searchDate}
                            onChange={(e) => {
                                setSearchDate(e.target.value)
                                setHasSearched(false)
                            }}
                        />

                        <Button text="Search" onClick={searchByDate} />

                        {expenses.length > 0 && (
                            <Box className="expense-list">
                                <h3>Search Results ({expenses.length})</h3>

                                {expenses.map((exp) => (
                                    <Box key={exp.expense_id} className="expense-item">
                                        <p><b>Reason:</b> {exp.reason}</p>
                                        <p><b>Amount:</b> Rs. {exp.amount}</p>
                                        <p><b>Date:</b> {exp.date}</p>

                                        {exp.bill_img && (
                                            <img
                                                src={`http://localhost:3000/uploads/${exp.bill_img}`}
                                                alt="Bill"
                                                style={{ width: '120px', marginTop: '5px' }}
                                            />
                                        )}

                                        <hr />
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {hasSearched && expenses.length === 0 && (
                            <p>No expenses found for this date.</p>
                        )}
                    </Box>
                )}

                {/* ALL */}
                {activeView === 'all' && (
                    <Box className="expense-list">
                        <h2>All Expenses ({expenses.length})</h2>

                        {expenses.length === 0 ? (
                            <p>No expenses found</p>
                        ) : (
                            expenses.map((exp) => (
                                <Box key={exp.expense_id} className="expense-item">
                                    <p><b>Reason:</b> {exp.reason}</p>
                                    <p><b>Amount:</b> Rs. {exp.amount}</p>
                                    <p><b>Date:</b> {exp.date}</p>

                                    {exp.bill_img && (
                                        <img
                                            src={`http://localhost:3000/uploads/${exp.bill_img}`}
                                            alt="Bill"
                                            style={{ width: '120px', marginTop: '5px' }}
                                        />
                                    )}

                                    <hr />
                                </Box>
                            ))
                        )}
                    </Box>
                )}

            </Box>
        </Box>
    )
}
