import Maid from '~/models/maidModel'

// Lấy chi tiết một Maid theo ID
export const getMaidById = async (req, res) => {
  try {
    const  userId  = req.params.id

    const maid = await Maid.findOne( {userId} )
    if (!maid) {
      return res.status(404).json({ message: 'Maid not found.' })
    }

    console.log('ID nhận được:', req.params.id);


    res.status(200).json(maid)
  } catch (error) {
    console.error('Error retrieving maid:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const getAllMaids = async (req, res) => {
  try {
    const maids = await Maid.find()
    res.status(200).json(maids)
  } catch (error) {
    console.error('Error retrieving maids:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const getTopMaids = async (req, res) => {
  try {
    const topMaids = await Maid.find()
      .sort({ ratings: -1 }) // Sắp xếp giảm dần theo ratings
      .limit(3) // Giới hạn kết quả trả về là 3 người giúp việc

    res.status(200).json(topMaids)
  } catch (error) {
    console.error('Error retrieving top maids:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

export const searchMaidsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Tên không được để trống.' });
    }

    const maids = await Maid.find().populate({
      path: 'userId',
      match: { name: { $regex: name, $options: 'i' } }, // Tìm theo regex, không phân biệt chữ hoa chữ thường
    });

    // Lọc bỏ những kết quả không có userId
    const filteredMaids = maids.filter((maid) => maid.userId !== null);

    if (filteredMaids.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người giúp việc nào.' });
    }

    res.status(200).json(filteredMaids);
  } catch (error) {
    console.error('Error searching maids:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};