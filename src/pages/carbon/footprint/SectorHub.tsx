import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Truck, Factory, Sprout, Building2, Wifi, Trash2, Layers } from 'lucide-react';

const sectors = [
    {
        id: 'energy',
        title: 'Electricity & Energy',
        description: 'Grid electricity, natural gas, and fuel combustion.',
        icon: Zap,
        path: '/carbon-footprint/energy',
        color: 'text-yellow-500'
    },
    {
        id: 'transport',
        title: 'Transportation',
        description: 'Vehicles, flights, freight, and public transit.',
        icon: Truck,
        path: '/carbon-footprint/transport',
        color: 'text-blue-500'
    },
    {
        id: 'industrial',
        title: 'Industrial & Manufacturing',
        description: 'Material production and process emissions.',
        icon: Factory,
        path: '/carbon-footprint/industrial',
        color: 'text-gray-500'
    },
    {
        id: 'agriculture',
        title: 'Agriculture & Land Use',
        description: 'Fertilizers, livestock, and land use change.',
        icon: Sprout,
        path: '/carbon-footprint/agriculture',
        color: 'text-green-500'
    },
    {
        id: 'buildings',
        title: 'Buildings & Construction',
        description: 'Embodied carbon and construction activities.',
        icon: Building2,
        path: '/carbon-footprint/buildings',
        color: 'text-orange-500'
    },
    {
        id: 'digital',
        title: 'Digital & Cloud',
        description: 'Data centers, cloud usage, and devices.',
        icon: Wifi,
        path: '/carbon-footprint/digital',
        color: 'text-purple-500'
    },
    {
        id: 'waste',
        title: 'Waste & Recycling',
        description: 'Landfill, incineration, and wastewater.',
        icon: Trash2,
        path: '/carbon-footprint/waste',
        color: 'text-red-500'
    }
];

const SectorHub = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Sector-Specific Carbon Calculator</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Calculate granular emissions across 7+ sectors with verified factors and transparent methodology.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {sectors.map((sector) => (
                    <Card
                        key={sector.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer border-t-4"
                        style={{ borderTopColor: 'currentColor' }}
                        onClick={() => navigate(sector.path)}
                    >
                        <CardHeader>
                            <div className={`mb-2 ${sector.color}`}>
                                <sector.icon className="h-8 w-8" />
                            </div>
                            <CardTitle>{sector.title}</CardTitle>
                            <CardDescription>{sector.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="ghost" className="w-full justify-start p-0 hover:bg-transparent">
                                Start Calculation →
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {/* Multi-Sector Card */}
                <Card
                    className="bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer col-span-1 md:col-span-2 lg:col-span-3"
                    onClick={() => navigate('/carbon-footprint/dashboard')}
                >
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Layers className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Multi-Sector Dashboard</CardTitle>
                            <CardDescription>View consolidated footprint and cross-sector insights</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl border">
                <h3 className="text-lg font-semibold mb-4">Methodology Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-muted-foreground">
                    <div>
                        <strong className="block text-foreground mb-1">Standards Compliance</strong>
                        Aligned with GHG Protocol, ISO 14064-1, and IPCC 2006 Guidelines.
                    </div>
                    <div>
                        <strong className="block text-foreground mb-1">Emission Factors</strong>
                        Sourced from IEA 2023, EPA eGRID, UK DEFRA, and IPCC AR5/AR6.
                    </div>
                    <div>
                        <strong className="block text-foreground mb-1">Transparency</strong>
                        Real-time formula display shows exactly how every number is calculated.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectorHub;
