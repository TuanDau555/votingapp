import React, { useState, useContext, useEffect } from 'react';
import { VotingContext } from '../context/Voter';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CandidateRegistration() {
  const {
    connectWallet,
    currentAccount,
    setCandidate,
    uploadToIPFSCandidate,
    error
  } = useContext(VotingContext);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    name: '',
    address: '',
    age: ''
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!currentAccount) {
      connectWallet();
    }
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
      const fileUrl = await uploadToIPFSCandidate(file);
      await setCandidate(formInput, fileUrl, router);
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
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '0 1rem'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '2.5rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    errorMessage: {
      backgroundColor: '#fee',
      color: '#c33',
      padding: '1rem',
      borderRadius: '10px',
      marginBottom: '1.5rem',
      border: '1px solid #fcc'
    },
    formGroup: {
      marginBottom: '1.5rem'
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
      width: '60px',
      height: '60px',
      borderRadius: '10px',
      objectFit: 'cover',
      border: '2px solid #667eea'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'borderColor 0.3s'
    },
    submitButton: {
      width: '100%',
      padding: '1rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.3s, boxShadow 0.3s'
    },
    submitButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1rem',
      cursor: 'pointer',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>VoteChain</h1>
        <div style={styles.navLinks}>
          <Link href="/" style={styles.navLink}>Trang chủ</Link>
          <Link href="/candidate-registration" style={{...styles.navLink, ...styles.navLinkActive}}>Ứng cử viên</Link>
          <Link href="/voterlist" style={styles.navLink}>Cử tri</Link>
          {currentAccount && (
            <span style={styles.walletAddress}>
              {currentAccount.slice(0,6)}...{currentAccount.slice(-4)}
            </span>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <button 
          onClick={() => router.back()}
          style={styles.backButton}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          ← Quay lại
        </button>

        <div style={styles.card}>
          <h2 style={styles.title}>Đăng ký ứng cử viên</h2>

          {error && (
            <div style={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Ảnh đại diện</label>
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
            </div>

            {/* Name */}
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
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Address */}
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
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Age */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tuổi</label>
              <input
                type="number"
                name="age"
                value={formInput.age}
                onChange={handleInputChange}
                required
                min="18"
                style={styles.input}
                placeholder="Nhập tuổi"
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !currentAccount}
              style={{
                ...styles.submitButton,
                ...(loading || !currentAccount ? styles.submitButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!loading && currentAccount) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký ứng cử viên'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}