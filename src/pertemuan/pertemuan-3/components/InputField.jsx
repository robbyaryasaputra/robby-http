// src/pertemuan-3/componen/InputField.jsx
export default function InputField({ label, type, placeholder, name, value, onChange, error }) {
    return (
        <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">{label}</label>
            <input
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                    error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500"
                }`}
            />
            {/* Alert error di bawah inputan */}
            {error && (
                <p className="text-red-500 text-xs mt-1 font-semibold animate-pulse">
                     {error}
                </p>
            )}
        </div>
    );
}