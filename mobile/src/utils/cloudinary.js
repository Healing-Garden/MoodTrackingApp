export const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/difg4vgbw/auto/upload";
export const JOURNAL_PRESET = "journal_unsigned";

export const uploadToCloudinary = async (uri) => {
    if (!uri) return null;

    const formData = new FormData();
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1].toLowerCase() : '';

    // Cloudinary treats audio as 'video' resource type
    const isAudio = ['mp3', 'wav', 'm4a', 'aac', '3gp'].includes(ext);
    const type = isAudio ? `audio/${ext}` : `image/${ext || 'jpg'}`;

    formData.append("file", { uri, name: filename, type });
    formData.append("upload_preset", JOURNAL_PRESET);
    // Force resource_type to auto or video if it's audio
    if (isAudio) {
        formData.append("resource_type", "video");
    }

    try {
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: "POST",
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};
