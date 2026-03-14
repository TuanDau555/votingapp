import React, { useState, useContext, useEffect } from 'react';
import { VotingContext } from '../context/Voter';
import Link from 'next/link';

export default function VoterList() {
  const {
    connectWallet,
    currentAccount,
    getAllVoterData,
    createVoter,
    uploadToIPFS,
    voterArray,
    voterLength,
    error
  } = useContext(VotingContext);

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formInput, setFormInput] = useState({
    name: '',
    address: '',
    position: ''
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    connectWallet();
    getAllVoterData();
  }, []);

  const handleInputChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Vui lòng chọn ảnh');
      return;
    }
    setLoading(true);
    try {
      const fileUrl = await uploadToIPFS(file);
      await createVoter(formInput, fileUrl, { push: (path) => setShowForm(false) });
      setShowForm(false);
      setFormInput({ name: '', address: '', position: '' });
      setFile(null);
      setPreviewUrl('');
      getAllVoterData();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const styles = {
    container: {
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    },
    navbar: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '1rem 2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backdropFilter: 'blur(10px)'
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center'
    },
    navLink: {
      textDecoration: 'none',
      color: '#555',
      fontWeight: '500',
      transition: 'color 0.3s'
    },
    navLinkActive: {
      color: '#667eea',
      fontWeight: '600'
    },
    walletAddress: {
      backgroundColor: '#f0f0f0',
      padding: '0.6rem 1.5rem',
      borderRadius: '50px',
      fontSize: '0.9rem',
      color: '#333',
      border: '1px solid #e0e0e0'
    },
    main: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 1rem'
    },
    headerCard: {
      background: 'white',
      borderRadius: '15px',
      padding: '1.5rem 2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    headerTitle: {
      fontSize: '1.8rem',
      color: '#333',
      marginBottom: '0.5rem'
    },
    headerSubtitle: {
      color: '#666',
      fontSize: '1rem'
    },
    addButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '0.8rem 2rem',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.3s, boxShadow 0.3s'
    },
    formCard: {
      background: 'white',
      borderRadius: '15px',
      padding: '2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    },
    formTitle: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#555',
      fontWeight: '500'
    },
    fileInputContainer: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    },
    fileInput: {
      flex: 1,
      padding: '0.75rem',
      border: '2px dashed #ddd',
      borderRadius: '10px',
      cursor: 'pointer'
    },
    preview: {
      width: '50px',
      height: '50px',
      borderRadius: '10px',
      objectFit: 'cover',
      border: '2px solid #667eea'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem'
    },
    submitButton: {
      background: '#4caf50',
      color: 'white',
      border: 'none',
      padding: '0.8rem 2rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'opacity 0.3s'
    },
    tableCard: {
      background: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      background: '#f8f9fa',
      padding: '1rem',
      textAlign: 'left',
      borderBottom: '2px solid #dee2e6',
      color: '#555',
      fontWeight: '600'
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #dee2e6',
      color: '#333'
    },
    voterImage: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    statusBadge: (voted) => ({
      padding: '0.25rem 1rem',
      borderRadius: '50px',
      fontSize: '0.85rem',
      fontWeight: '500',
      backgroundColor: voted ? '#d4edda' : '#fff3cd',
      color: voted ? '#155724' : '#856404',
      display: 'inline-block'
    }),
    errorMessage: {
      backgroundColor: '#fee',
      color: '#c33',
      padding: '1rem',
      borderRadius: '10px',
      marginBottom: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>VoteChain</h1>
        <div style={styles.navLinks}>
          <Link href="/" style={styles.navLink}>Trang chủ</Link>
          <Link href="/candidate-registration" style={styles.navLink}>Ứng cử viên</Link>
          <Link href="/voterlist" style={{...styles.navLink, ...styles.navLinkActive}}>Cử tri</Link>
          {currentAccount && (
            <span style={styles.walletAddress}>
              {currentAccount.slice(0,6)}...{currentAccount.slice(-4)}
            </span>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.headerCard}>
          <div>
            <h2 style={styles.headerTitle}>Danh sách cử tri</h2>
            <p style={styles.headerSubtitle}>Tổng số cử tri: {voterLength}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.addButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {showForm ? 'Đóng' : '+ Thêm cử tri'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}

        {/* Add Voter Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Thêm cử tri mới</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.fileInputContainer}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  style={styles.fileInput}
                />
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" style={styles.preview} />
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formInput.name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Nhập họ tên"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Địa chỉ ví</label>
                <input
                  type="text"
                  name="address"
                  value={formInput.address}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Nhập địa chỉ ví"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Chức vụ</label>
                <input
                  type="text"
                  name="position"
                  value={formInput.position}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Nhập chức vụ"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Đang xử lý...' : 'Thêm cử tri'}
              </button>
            </form>
          </div>
        )}

        {/* Voter Table */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Ảnh</th>
                <th style={styles.th}>Tên</th>
                <th style={styles.th}>Địa chỉ</th>
                <th style={styles.th}>Chức vụ</th>
                <th style={styles.th}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {voterArray && voterArray.length > 0 ? (
                voterArray.map((voter, index) => (
                  <tr key={index}>
                    <td style={styles.td}>
                      <img 
                        src={voter[4] || 'https://via.placeholder.com/40'} 
                        alt="" 
                        style={styles.voterImage}
                      />
                    </td>
                    <td style={styles.td}>{voter[1]}</td>
                    <td style={styles.td}>
                      {voter[0].slice(0,6)}...{voter[0].slice(-4)}
                    </td>
                    <td style={styles.td}>{voter[2]}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge(voter[3])}>
                        {voter[3] ? 'Đã bầu' : 'Chưa bầu'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{...styles.td, textAlign: 'center'}}>
                    Chưa có cử tri nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}