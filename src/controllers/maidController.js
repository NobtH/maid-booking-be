import Maid from '~/models/maidModel';

// Lấy chi tiết một Maid theo ID
export const getMaidById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm Maid theo ID, có thể populate reviews nếu cần
    const maid = await Maid.findById(id).populate('maids'); 
    if (!maid) {
      return res.status(404).json({ message: 'Maid not found.' });
    }

    res.status(200).json(maid);
  } catch (error) {
    console.error('Error retrieving maid:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};
