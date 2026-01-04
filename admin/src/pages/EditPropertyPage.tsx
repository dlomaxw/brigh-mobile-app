import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import api from '../services/api';

export default function EditPropertyPage() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await api.get(`/properties/${id}`);
                setProperty(res.data);
            } catch (error) {
                console.error(error);
                // Handle 404
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProperty();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!property) return <div>Property not found</div>;

    return <PropertyForm initialData={property} isEdit={true} />;
}
