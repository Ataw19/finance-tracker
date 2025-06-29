import React, { useState, useEffect } from 'react';

// Komponen ini menerima beberapa props dari HalamanUtama.js:
// isOpen: boolean untuk membuka/menutup modal
// onClose: fungsi untuk menutup modal
// onSave: fungsi untuk menyimpan data
// initialData: data transaksi jika dalam mode edit
// categories: daftar kategori untuk ditampilkan di dropdown
const ModalTransaksi = ({ isOpen, onClose, onSave, initialData = null, categories = [],accounts = [] }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    transaction_date: new Date().toISOString().slice(0, 10),
    category_id: '',
    account_id: '', // Tambahkan akun untuk transaksi
    type: 'expense', // Tipe default adalah 'expense' (pengeluaran)
  });
  const [error, setError] = useState('');

  // useEffect ini akan berjalan setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Jika ini mode EDIT, isi form dengan data yang sudah ada
        setFormData({
          description: initialData.description || '',
          amount: initialData.amount || '',
          transaction_date: initialData.transaction_date ? new Date(initialData.transaction_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          category_id: initialData.category_id || '',
          account_id: initialData.account_id || '',
          type: initialData.type || 'expense',
        });
      } else {
        // Jika ini mode TAMBAH, reset form ke keadaan awal
        setFormData({
          description: '',
          amount: '',
          transaction_date: new Date().toISOString().slice(0, 10),
          category_id: '',
          account_id: '', 
          type: initialData?.type || 'expense',
        });
      }
      setError(''); // Selalu hapus pesan error setiap modal dibuka
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.transaction_date || !formData.account_id) {
      setError('Harap isi Deskripsi, Jumlah, Akun, dan Tanggal.');
      return;
    }
    // Kategori hanya wajib jika tipenya 'expense'
    if (formData.type === 'expense' && !formData.category_id) {
        setError('Kategori wajib diisi untuk pengeluaran.');
        return;
    }
    setError('');
    // Kirim data. Jika 'income', category_id akan kosong, backend akan handle sbg NULL.
    onSave({ ...formData, id: initialData?.id });
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{initialData ? 'Edit Transaksi' : 'Tambah Transaksi'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <input
              type="text" name="description" value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jumlah (Rp)</label>
            <input
              type="number" name="amount" value={formData.amount}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700">Akun</label>
              <select
                name="account_id" value={formData.account_id}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Pilih Akun</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name} (Rp {Number(acc.balance).toLocaleString('id-ID')})</option>
                ))}
              </select>
          </div>
          {formData.type === 'expense' && (
          <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select
                name="category_id" value={formData.category_id}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required // Atribut required ini penting untuk pengeluaran
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" className="bg-gray-200 px-4 py-2 rounded-md" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTransaksi;