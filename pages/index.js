import React, { useState, useContext, useEffect } from 'react';
import { VotingContext } from '../context/Voter';
import Link from 'next/link';

export default function Home() {
  const {
    connectWallet,
    checkIfWalletConnected,
    currentAccount,
    getNewCandidate,
    candidateArray,
    candidateLength,
    giveVote,
    error
  } = useContext(VotingContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfWalletConnected();
    getNewCandidate();
  }, []);

  const handleVote = async (candidate) => {
    setLoading(true);
    try {
      await giveVote(candidate);
      alert('✅ Bầu chọn thành công!');
      getNewCandidate();
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
      transition: 'color 0.3s',
      cursor: 'pointer'
    },
    navLinkActive: {
      color: '#667eea',
      fontWeight: '600'
    },
    walletButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '0.6rem 1.5rem',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'transform 0.3s, boxShadow 0.3s'
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
      margin: '0 auto',
      padding: '2rem'
    },
    heroCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '3rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      textAlign: 'center',
      marginBottom: '3rem'
    },
    heroTitle: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '1rem'
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      color: '#666',
      marginBottom: '1.5rem'
    },
    candidateCount: {
      display: 'inline-block',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '0.5rem 2rem',
      borderRadius: '50px',
      fontSize: '1.1rem'
    },
    errorMessage: {
      backgroundColor: '#fee',
      color: '#c33',
      padding: '1rem',
      borderRadius: '10px',
      marginBottom: '1.5rem',
      border: '1px solid #fcc'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem'
    },
    card: {
      background: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, boxShadow 0.3s',
      cursor: 'pointer'
    },
    cardImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    cardContent: {
      padding: '1.5rem'
    },
    cardName: {
      fontSize: '1.3rem',
      color: '#333',
      marginBottom: '0.5rem',
      fontWeight: '600'
    },
    cardInfo: {
      color: '#666',
      fontSize: '0.9rem',
      marginBottom: '0.5rem'
    },
    cardVotes: {
      color: '#667eea',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    voteButton: {
      width: '100%',
      padding: '0.8rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'opacity 0.3s'
    },
    voteButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    emptyState: {
      gridColumn: '1/-1',
      background: 'white',
      padding: '4rem',
      borderRadius: '15px',
      textAlign: 'center'
    },
    emptyStateText: {
      color: '#666',
      fontSize: '1.2rem',
      marginBottom: '1.5rem'
    },
    addButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 2.5rem',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>VoteChain</h1>
        
        <div style={styles.navLinks}>
          <Link href="/" style={{...styles.navLink, ...styles.navLinkActive}}>Trang chủ</Link>
          <Link href="/candidate-registration" style={styles.navLink}>Ứng cử viên</Link>
          <Link href="/voterlist" style={styles.navLink}>Cử tri</Link>
          
          {!currentAccount ? (
            <button 
              onClick={connectWallet}
              style={styles.walletButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Kết nối ví
            </button>
          ) : (
            <span style={styles.walletAddress}>
              {currentAccount.slice(0,6)}...{currentAccount.slice(-4)}
            </span>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Hero Section */}
        <div style={styles.heroCard}>
          <h2 style={styles.heroTitle}>Hệ thống bầu cử phi tập trung</h2>
          <p style={styles.heroSubtitle}>Minh bạch - An toàn - Không thể gian lận</p>
          <span style={styles.candidateCount}>
            Số lượng ứng cử viên: {candidateLength}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}

        {/* Candidates Grid */}
        <div style={styles.grid}>
          {candidateArray && candidateArray.length > 0 ? (
            candidateArray.map((candidate, index) => (
              <div 
                key={index} 
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <img 
                  src={candidate[5] || 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={candidate[2]}
                  style={styles.cardImage}
                />
                <div style={styles.cardContent}>
                  <h3 style={styles.cardName}>{candidate[2]}</h3>
                  <p style={styles.cardInfo}>
                    <strong>Địa chỉ:</strong> {candidate[0].slice(0,6)}...{candidate[0].slice(-4)}
                  </p>
                  <p style={styles.cardInfo}>
                    <strong>Tuổi:</strong> {candidate[1].toString()}
                  </p>
                  <p style={styles.cardVotes}>
                    🗳️ {candidate[4].toString()} phiếu
                  </p>
                  <button
                    onClick={() => handleVote({ address: candidate[0], id: index })}
                    disabled={loading || !currentAccount}
                    style={{
                      ...styles.voteButton,
                      ...(loading || !currentAccount ? styles.voteButtonDisabled : {})
                    }}
                  >
                    {loading ? 'Đang xử lý...' : 'Bầu chọn'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>📭 Chưa có ứng cử viên nào</p>
              {currentAccount && (
                <Link href="/candidate-registration">
                  <button 
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
                    + Thêm ứng cử viên
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}