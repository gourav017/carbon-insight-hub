import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const SectorPlaceholder = () => {
    const navigate = useNavigate();
    const { sectorId } = useParams();

    const sectorNames: Record<string, string> = {
        industrial: 'Industrial & Manufacturing',
        agriculture: 'Agriculture & Land Use',
        buildings: 'Buildings & Construction',
        digital: 'Digital & Cloud',
        waste: 'Waste & Recycling'
    };

    const title = sectorNames[sectorId || ''] || 'Sector Calculator';

    return (
        <div className="container mx-auto py-20 px-4 text-center">
            <Button variant="ghost" onClick={() => navigate('/carbon-footprint')} className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
            </Button>

            <div className="max-w-md mx-auto">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Construction className="h-10 w-10 text-slate-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <p className="text-muted-foreground mb-8">
                    The detailed calculator for this sector is currently under development.
                    It will include specific factors and logic as per the implementation plan.
                </p>
                <Button onClick={() => navigate('/carbon-footprint')}>
                    Return to Sector Hub
                </Button>
            </div>
        </div>
    );
};

export default SectorPlaceholder;
