import React, { useState, useEffect } from 'react';

// Main Search App Component
const Search = () => {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [indexStatus, setIndexStatus] = useState({ status: 'loading' });

  // API URL - replace with your ngrok URL when available
  // Format should be: 'https://your-ngrok-url.ngrok.io/api'
  
  // REPLACE THE ABOVE URL WITH YOUR NGROK URL WHEN DEPLOYED
   const API_URL = 'https://kattis-search-913142512012.us-central1.run.app/api';

  // Check index status on component mount
  useEffect(() => {
    checkIndexStatus();
  }, []);

  // API function to check index status
  const checkIndexStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/status`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const status = await response.json();
      setIndexStatus(status);
    } catch (err) {
      setError("Failed to connect to the server. Please check if the backend is running.");
      setIndexStatus({ status: 'error' });
    }
  };

  // API function to search problems
  const searchProblems = async (query, maxResults = 20) => {
    try {
      const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}&max_results=${maxResults}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching problems:', error);
      throw error;
    }
  };

  // Handle search form submission
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const results = await searchProblems(query);
      setSearchResults(results);
    } catch (err) {
      setError("Failed to perform search. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to highlight search terms in text
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    // Split the query into words
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    
    if (queryWords.length === 0) return text;
    
    // Create a regex pattern for highlighting
    const pattern = new RegExp(`(${queryWords.join('|')})`, 'gi');
    
    // Split the text by the pattern and create an array of elements
    const parts = text.split(pattern);
    
    return parts.map((part, i) => {
      // Check if this part matches any of the query words
      if (queryWords.some(word => part.toLowerCase() === word)) {
        return <span key={i} style={styles.highlight}>{part}</span>;
      }
      return part;
    });
  };

  // Styles object (instead of CSS file)
  const styles = {
    // Main container styles
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Roboto, Segoe UI, Arial, sans-serif',
      lineHeight: 1.6,
      color: '#333333',
    },
    header: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      color: '#1e88e5',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#757575',
      marginBottom: '20px',
    },
    main: {
      background: '#ffffff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    // Status bar styles
    statusBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px',
    },
    statusReady: {
      backgroundColor: '#e8f5e9',
      borderLeft: '4px solid #4caf50',
    },
    statusLoading: {
      backgroundColor: '#e3f2fd',
      borderLeft: '4px solid #2196f3',
    },
    statusWarning: {
      backgroundColor: '#fff3e0',
      borderLeft: '4px solid #ff9800',
    },
    statusError: {
      backgroundColor: '#ffebee',
      borderLeft: '4px solid #f44336',
    },
    statusIndicator: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      marginRight: '10px',
    },
    statusMessage: {
      fontSize: '0.9rem',
    },
    // Search bar styles
    searchBar: {
      marginBottom: '30px',
    },
    searchForm: {
      width: '100%',
    },
    searchInputContainer: {
      display: 'flex',
      marginBottom: '10px',
    },
    searchInput: {
      flex: 1,
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e0e0e0',
      borderRadius: '4px 0 0 4px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    searchInputFocus: {
      borderColor: '#1e88e5',
    },
    searchButton: {
      padding: '12px 24px',
      backgroundColor: '#1e88e5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0 4px 4px 0',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    searchButtonHover: {
      backgroundColor: '#1565c0',
    },
    searchTips: {
      fontSize: '0.9rem',
      color: '#757575',
      marginTop: '8px',
    },
    // Error message styles
    errorMessage: {
      padding: '12px 16px',
      backgroundColor: '#ffebee',
      color: '#c62828',
      borderRadius: '4px',
      marginBottom: '20px',
      borderLeft: '4px solid #f44336',
    },
    // Spinner styles
    spinnerContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
    },
    spinner: {
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #1e88e5',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 2s linear infinite',
      marginBottom: '20px',
    },
    spinnerText: {
      color: '#757575',
    },
    // Results styles
    resultsContainer: {
      marginTop: '20px',
    },
    resultsHeader: {
      fontSize: '1.5rem',
      marginBottom: '20px',
      color: '#424242',
    },
    noResults: {
      textAlign: 'center',
      padding: '40px 0',
      color: '#757575',
    },
    searchResults: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
    },
    resultCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    resultCardHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    resultHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '10px',
    },
    resultTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#1e88e5',
      marginBottom: '8px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
    resultType: {
      fontSize: '0.8rem',
      padding: '4px 8px',
      backgroundColor: '#e3f2fd',
      color: '#1565c0',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
    },
    resultId: {
      fontSize: '0.9rem',
      color: '#757575',
      marginBottom: '12px',
    },
    resultUrl: {
      marginTop: '15px',
    },
    kattisLink: {
      display: 'inline-block',
      padding: '8px 16px',
      backgroundColor: '#ff6d00',
      color: '#ffffff',
      textDecoration: 'none',
      borderRadius: '4px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    kattisLinkHover: {
      backgroundColor: '#e65100',
    },
    highlight: {
      backgroundColor: '#fff9c4',
      padding: '0 2px',
      borderRadius: '2px',
    },
    footer: {
      marginTop: '40px',
      textAlign: 'center',
      color: '#757575',
      fontSize: '0.9rem',
      padding: '20px 0',
      borderTop: '1px solid #e0e0e0',
    },
    // Match percentage badge
    matchPercentage: {
      display: 'inline-block',
      padding: '2px 8px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      borderRadius: '10px',
      color: 'white',
      marginLeft: '8px',
    },
    // Different colors for match percentage
    matchPerfect: {
      backgroundColor: '#4caf50',
    },
    matchHigh: {
      backgroundColor: '#8bc34a',
    },
    matchMedium: {
      backgroundColor: '#ffc107',
    },
    matchLow: {
      backgroundColor: '#ff9800',
    },
  };

  // Generate status bar styling based on current status
  const getStatusBarStyle = () => {
    let baseStyle = {...styles.statusBar};
    
    switch (indexStatus.status) {
      case 'ready':
        return {...baseStyle, ...styles.statusReady};
      case 'loading':
        return {...baseStyle, ...styles.statusLoading};
      case 'error':
        return {...baseStyle, ...styles.statusError};
      default:
        return {...baseStyle, ...styles.statusWarning};
    }
  };

  // Get status message based on current status
  const getStatusMessage = () => {
    switch (indexStatus.status) {
      case 'loading':
        return 'Connecting to server...';
      case 'ready':
        return `Server ready - ${indexStatus.indexed_problems} problems indexed`;
      case 'not_indexed':
        return 'Server is initializing the search index. This may take a moment...';
      case 'error':
        return 'Error connecting to server. Check if the backend is running.';
      default:
        return 'Unknown server status';
    }
  };

  // Get match percentage badge style based on percentage
  const getMatchPercentageStyle = (percentage) => {
    let baseStyle = {...styles.matchPercentage};
    
    if (percentage >= 100) {
      return {...baseStyle, ...styles.matchPerfect};
    } else if (percentage >= 90) {
      return {...baseStyle, ...styles.matchHigh};
    } else if (percentage >= 80) {
      return {...baseStyle, ...styles.matchMedium};
    } else {
      return {...baseStyle, ...styles.matchLow};
    }
  };

  // StatusBar Component (inline)
  const StatusBar = () => (
    <div style={getStatusBarStyle()}>
      <div style={{
        ...styles.statusIndicator,
        backgroundColor: indexStatus.status === 'ready' ? '#4caf50' : 
                         indexStatus.status === 'loading' ? '#2196f3' : 
                         indexStatus.status === 'error' ? '#f44336' : '#ff9800'
      }}></div>
      <div style={styles.statusMessage}>{getStatusMessage()}</div>
    </div>
  );

  // SearchBar Component (inline)
  const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [inputFocused, setInputFocused] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSearch(query);
    };

    return (
      <div style={styles.searchBar}>
        <form style={styles.searchForm} onSubmit={handleSubmit}>
          <div style={styles.searchInputContainer}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Kattis problems..."
              style={{
                ...styles.searchInput,
                ...(inputFocused ? styles.searchInputFocus : {})
              }}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            <button 
              type="submit" 
              style={styles.searchButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = styles.searchButtonHover.backgroundColor;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = styles.searchButton.backgroundColor;
              }}
            >
              Search
            </button>
          </div>
          <div style={styles.searchTips}>
            <p>
              <strong>Search tips:</strong> Try searching for algorithm names, problem types, or specific keywords
              from problem statements.
            </p>
          </div>
        </form>
      </div>
    );
  };

  // Spinner Component (inline)
  const Spinner = () => (
    <div style={styles.spinnerContainer}>
      <div style={{
        ...styles.spinner,
        animation: 'spin 2s linear infinite'
      }}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <p style={styles.spinnerText}>Searching problems...</p>
    </div>
  );

  // SearchResults Component (inline)
  const SearchResults = () => {
    // Filter for 100% matches only if there are any
    const filteredResults = searchResults.length > 0 && searchResults[0].match_percentage === 100 ? 
      [searchResults[0]] : searchResults;

    if (!filteredResults || filteredResults.length === 0) {
      return (
        <div style={styles.noResults}>
          <p>No matching problems found. Try different search terms.</p>
        </div>
      );
    }

    return (
      <div style={styles.searchResults}>
        {filteredResults.map((result) => (
          <div 
            key={result.id} 
            style={styles.resultCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = styles.resultCardHover.transform;
              e.currentTarget.style.boxShadow = styles.resultCardHover.boxShadow;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = styles.resultCard.boxShadow;
            }}
          >
            <div style={styles.resultHeader}>
              <h3 style={styles.resultTitle}>
                {highlightText(result.title, searchQuery)}
              </h3>
              <div style={styles.resultType}>
                {result.match_type === "exact_title_match" ? "Title match" : 
                 result.match_type === "exact_content_match" ? "Content match" : "Partial match"}
                <span style={getMatchPercentageStyle(result.match_percentage)}>
                  {result.match_percentage}%
                </span>
              </div>
            </div>
            <div style={styles.resultId}>ID: {result.id}</div>
            <div style={styles.resultUrl}>
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.kattisLink}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = styles.kattisLinkHover.backgroundColor;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = styles.kattisLink.backgroundColor;
                }}
              >
                View on Kattis
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Main render
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Kattis Problem Search</h1>
        <p style={styles.subtitle}>Search through Kattis programming problems to find what you need</p>
      </header>

      <main style={styles.main}>
        <StatusBar />
        
        <SearchBar />
        
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}
        
        {isLoading ? (
          <Spinner />
        ) : (
          searchQuery && (
            <div style={styles.resultsContainer}>
              <h2 style={styles.resultsHeader}>
                {searchResults.length === 0
                  ? "No results found"
                  : `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`}
              </h2>
              <SearchResults />
            </div>
          )
        )}
      </main>

      <footer style={styles.footer}>
        <p>Kattis Problem Search - Search through {indexStatus.indexed_problems || 'thousands of'} programming problems</p>
      </footer>
    </div>
  );
};

export default Search;