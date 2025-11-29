const fetchGames = async () => {
  try {
    setLoading(true);
    setError(''); // Clear previous errors
    
    console.log('🎮 Fetching games...');
    const { data } = await api.get('/games');
    
    console.log('✅ Games fetched:', data);
    setGames(data.data || []);
    setFilteredGames(data.data || []);
  } catch (err) {
    console.error('❌ Fetch games error:', err);
    const errorMessage = err.response?.data?.message 
      || err.message 
      || 'Failed to fetch games. Please try again later.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};