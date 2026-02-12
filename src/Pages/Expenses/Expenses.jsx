import React, { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  InputAdornment,
  Avatar,
  Divider,
  Fab
} from '@mui/material'
import {
  Add,
  Delete,
  Search,
  Receipt,
  CalendarToday,
  AttachMoney,
  Description,
  CloudUpload,
  Image as ImageIcon,
  List as ListIcon,
  Close
} from '@mui/icons-material'
import axios from 'axios'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [activeTab, setActiveTab] = useState(0) // 0=all, 1=create, 2=search, 3=delete
  const [searchDate, setSearchDate] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [billImg, setBillImg] = useState(null)
  const [billPreview, setBillPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageDialog, setImageDialog] = useState({ open: false, url: '' })

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
    const file = e.target.files[0]
    if (file) {
      setBillImg(file)
      setBillPreview(URL.createObjectURL(file))
    }
  }

  const clearForm = () => {
    setFormData({ reason: '', amount: '', date: '' })
    setBillImg(null)
    setBillPreview(null)
  }

  // ================= GET ALL =================
  const getAllExpenses = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await axios.get('https://api.thurunu.me/api/expenses/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setExpenses(res.data)
      setActiveTab(0)
    } catch (err) {
      setError('Failed to fetch expenses')
    } finally {
      setIsLoading(false)
    }
  }

  // ================= CREATE =================
  const createExpense = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const data = new FormData()
      data.append('reason', formData.reason)
      data.append('amount', formData.amount)
      data.append('date', formData.date)

      if (billImg) {
        data.append('bill_img', billImg)
      }

      await axios.post('https://api.thurunu.me/api/expenses/add', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      setSuccess('Expense added successfully!')
      clearForm()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense')
    } finally {
      setIsLoading(false)
    }
  }

  // ================= SEARCH BY DATE =================
  const searchByDate = async () => {
    if (!searchDate) {
      setError('Please select a date')
      return
    }

    setHasSearched(true)
    setIsLoading(true)
    setError('')

    try {
      const res = await axios.get(
        `https://api.thurunu.me/api/expenses/search?date=${searchDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      const normalized = res.data.map((exp) => ({
        ...exp,
        date: new Date(exp.date).toISOString().split('T')[0]
      }))

      setExpenses(normalized)
    } catch {
      const allExpenses = await axios.get(
        'https://api.thurunu.me/api/expenses/all',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      const filtered = allExpenses.data.filter((exp) => {
        const expDate = new Date(exp.date).toISOString().split('T')[0]
        return expDate === searchDate
      })

      setExpenses(filtered)
    } finally {
      setIsLoading(false)
    }
  }

  // ================= DELETE =================
  const deleteExpenseById = async () => {
    if (!deleteId) {
      setError('Please enter Expense ID')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.delete(
        `https://api.thurunu.me/api/expenses/delete/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      setSuccess('Expense deleted successfully!')
      setDeleteId('')
      getAllExpenses()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Expense not found')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setError('')
    setSuccess('')
    setHasSearched(false)
    if (newValue === 0) {
      getAllExpenses()
    }
  }

  const openImageDialog = (url) => {
    setImageDialog({ open: true, url })
  }

  // ================= RENDER EXPENSE CARD =================
  const renderExpenseCard = (exp) => (
    <Grid item xs={12} sm={6} md={4} key={exp.expense_id}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
      >
        {exp.bill_img && (
          <CardMedia
            component="img"
            height="160"
            image={`https://api.thurunu.me/uploads/${exp.bill_img}`}
            alt="Bill"
            sx={{ cursor: 'pointer', objectFit: 'cover' }}
            onClick={() =>
              openImageDialog(`https://api.thurunu.me/uploads/${exp.bill_img}`)
            }
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Chip
              label={`ID: ${exp.expense_id}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Rs. ${parseFloat(exp.amount).toLocaleString()}`}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            {exp.reason}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(exp.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={6}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <Receipt sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Expense Manager
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track and manage your expenses
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Tabs Navigation */}
        <Paper
          elevation={6}
          sx={{
            mb: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                py: 2
              },
              '& .Mui-selected': {
                color: '#667eea'
              },
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                height: 3
              }
            }}
          >
            <Tab icon={<ListIcon />} label="All Expenses" iconPosition="start" />
            <Tab icon={<Add />} label="Create" iconPosition="start" />
            <Tab icon={<Search />} label="Search" iconPosition="start" />
            <Tab icon={<Delete />} label="Delete" iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        {/* Content */}
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            minHeight: 400
          }}
        >
          {/* ALL EXPENSES TAB */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                All Expenses ({expenses.length})
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : expenses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Receipt sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No expenses found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first expense to get started
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {expenses.map((exp) => renderExpenseCard(exp))}
                </Grid>
              )}
            </Box>
          )}

          {/* CREATE EXPENSE TAB */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Create New Expense
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box component="form" onSubmit={createExpense}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Grocery shopping"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Description />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<CloudUpload />}
                      sx={{
                        py: 2,
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: billPreview ? '#667eea' : 'divider'
                      }}
                    >
                      {billPreview ? 'Change Bill Image' : 'Upload Bill Image'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </Grid>

                  {billPreview && (
                    <Grid item xs={12}>
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <img
                          src={billPreview}
                          alt="Bill Preview"
                          style={{
                            maxWidth: '300px',
                            maxHeight: '300px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'error.main', color: 'white' }
                          }}
                          onClick={() => {
                            setBillImg(null)
                            setBillPreview(null)
                          }}
                        >
                          <Close />
                        </IconButton>
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={isLoading}
                      sx={{
                        py: 1.5,
                        background:
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)'
                        }
                      }}
                    >
                      {isLoading ? (
                        <>
                          <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                          Adding...
                        </>
                      ) : (
                        'Add Expense'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}

          {/* SEARCH TAB */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Search by Date
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    type="date"
                    value={searchDate}
                    onChange={(e) => {
                      setSearchDate(e.target.value)
                      setHasSearched(false)
                    }}
                    InputLabelProps={{ shrink: true }}
                    label="Select Date"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={searchByDate}
                    disabled={isLoading}
                    sx={{
                      height: '56px',
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 600,
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)'
                      }
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : hasSearched ? (
                expenses.length > 0 ? (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Found {expenses.length} expense(s)
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      {expenses.map((exp) => renderExpenseCard(exp))}
                    </Grid>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Search sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No expenses found for this date
                    </Typography>
                  </Box>
                )
              ) : null}
            </Box>
          )}

          {/* DELETE TAB */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Delete Expense
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Expense ID"
                    type="number"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                    placeholder="Enter expense ID to delete"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Receipt />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={deleteExpenseById}
                    disabled={isLoading}
                    sx={{ height: '56px', fontWeight: 600 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Image Dialog */}
      <Dialog
        open={imageDialog.open}
        onClose={() => setImageDialog({ open: false, url: '' })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Bill Image
          <IconButton
            onClick={() => setImageDialog({ open: false, url: '' })}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img
            src={imageDialog.url}
            alt="Bill"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </DialogContent>
      </Dialog>

      {/* Floating Action Button for Quick Add */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)'
          }
        }}
        onClick={() => setActiveTab(1)}
      >
        <Add />
      </Fab>
    </Box>
  )
}