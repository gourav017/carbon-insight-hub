import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Truck, Plane, Ship, ArrowLeft, History, Save, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateVehicle, calculateFlight, calculateFreight } from '../../../lib/carbon/sectors/transport';
import { CalculationResult } from '../../../types/carbon-sectors';
import {
    saveToHistory,
    getHistoryByType,
    deleteFromHistory,
    FootprintHistoryItem
} from '../../../lib/carbon/footprintStorage';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

const TransportCalculator = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('vehicles');
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyItems, setHistoryItems] = useState<FootprintHistoryItem[]>([]);

    // Vehicle State
    const [vehicleType, setVehicleType] = useState<string>('car');
    const [vehicleFuel, setVehicleFuel] = useState<string>('gasoline');
    const [vehicleSize, setVehicleSize] = useState<string>('medium');
    const [vehicleDistance, setVehicleDistance] = useState<number>(0);
    const [vehicleUnit, setVehicleUnit] = useState<string>('km');
    const [vehicleResult, setVehicleResult] = useState<CalculationResult | null>(null);

    // Flight State
    const [flightOrigin, setFlightOrigin] = useState('');
    const [flightDest, setFlightDest] = useState('');
    const [flightClass, setFlightClass] = useState<string>('economy');
    const [flightPax, setFlightPax] = useState<number>(1);
    const [flightRoundTrip, setFlightRoundTrip] = useState<boolean>(true);
    const [flightRF, setFlightRF] = useState<boolean>(true);
    const [flightResult, setFlightResult] = useState<CalculationResult | null>(null);

    // Freight State
    const [freightMode, setFreightMode] = useState<string>('road');
    const [freightWeight, setFreightWeight] = useState<number>(0);
    const [freightDist, setFreightDist] = useState<number>(0);
    const [freightResult, setFreightResult] = useState<CalculationResult | null>(null);

    const handleVehicleCalculate = () => {
        const result = calculateVehicle({
            // @ts-ignore
            type: vehicleType,
            fuel: vehicleFuel,
            size: vehicleSize,
            distance: vehicleDistance,
            unit: vehicleUnit
        });
        setVehicleResult(result);
    };

    const handleFlightCalculate = () => {
        const result = calculateFlight({
            origin: flightOrigin,
            destination: flightDest,
            passengers: flightPax,
            // @ts-ignore
            class: flightClass,
            roundTrip: flightRoundTrip,
            includeRF: flightRF
        });
        setFlightResult(result);
    };

    const handleFreightCalculate = () => {
        const result = calculateFreight({
            // @ts-ignore
            mode: freightMode,
            weight: freightWeight,
            weightUnit: 'tonnes',
            distance: freightDist,
            distanceUnit: 'km'
        });
        setFreightResult(result);
    };

    const handleSaveHistory = (type: 'vehicle' | 'flight' | 'freight') => {
        if (type === 'vehicle' && vehicleResult) {
            saveToHistory('transport', { type: vehicleType, fuel: vehicleFuel, size: vehicleSize, distance: vehicleDistance, unit: vehicleUnit, subType: 'vehicle' }, vehicleResult);
            toast({ title: "Saved", description: "Vehicle calculation saved to history." });
        } else if (type === 'flight' && flightResult) {
            saveToHistory('transport', { origin: flightOrigin, destination: flightDest, class: flightClass, passengers: flightPax, roundTrip: flightRoundTrip, rf: flightRF, subType: 'flight' }, flightResult);
            toast({ title: "Saved", description: "Flight calculation saved to history." });
        } else if (type === 'freight' && freightResult) {
            saveToHistory('transport', { mode: freightMode, weight: freightWeight, distance: freightDist, subType: 'freight' }, freightResult);
            toast({ title: "Saved", description: "Freight calculation saved to history." });
        }
        loadHistory();
    };

    const loadHistory = () => {
        setHistoryItems(getHistoryByType('transport'));
    };

    const handleDeleteHistory = (id: string) => {
        deleteFromHistory(id);
        loadHistory();
    };

    const handleLoadHistoryItem = (item: FootprintHistoryItem) => {
        if (item.inputs.subType === 'vehicle') {
            setActiveTab('vehicles');
            setVehicleType(item.inputs.type);
            setVehicleFuel(item.inputs.fuel);
            setVehicleSize(item.inputs.size);
            setVehicleDistance(item.inputs.distance);
            setVehicleUnit(item.inputs.unit);
            setVehicleResult(item.result);
        } else if (item.inputs.subType === 'flight') {
            setActiveTab('flights');
            setFlightOrigin(item.inputs.origin);
            setFlightDest(item.inputs.destination);
            setFlightClass(item.inputs.class);
            setFlightPax(item.inputs.passengers);
            setFlightRoundTrip(item.inputs.roundTrip);
            setFlightRF(item.inputs.rf);
            setFlightResult(item.result);
        } else if (item.inputs.subType === 'freight') {
            setActiveTab('freight');
            setFreightMode(item.inputs.mode);
            setFreightWeight(item.inputs.weight);
            setFreightDist(item.inputs.distance);
            setFreightResult(item.result);
        }
        setHistoryOpen(false);
    };

    const CalculationBreakdown = ({ result, type }: { result: CalculationResult, type: 'vehicle' | 'flight' | 'freight' }) => (
        <div className="bg-slate-900 text-slate-50 p-6 rounded-lg font-mono text-sm mt-6">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
                <span className="font-bold text-lg">CALCULATION BREAKDOWN</span>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={() => handleSaveHistory(type)}>
                    <Save className="w-4 h-4 mr-2" /> Save
                </Button>
            </div>
            <div className="space-y-4">
                {result.breakdown.map((step, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                        <span className="text-slate-400 text-xs uppercase tracking-wider">{step.step}</span>
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-300">{step.formula}</span>
                            <span className="text-emerald-400 font-bold">
                                = {step.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} {step.unit}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t border-slate-700 mt-6 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                    <span>RESULT</span>
                    <span className="text-emerald-400">{result.emissionsTonnes.toFixed(2)} tCO2e</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                    Source: {result.source}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <Button variant="ghost" onClick={() => navigate('/carbon-footprint')} className="pl-0">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
                </Button>

                <Dialog open={historyOpen} onOpenChange={(open) => {
                    setHistoryOpen(open);
                    if (open) loadHistory();
                }}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <History className="w-4 h-4 mr-2" />
                            History
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Transport Calculation History</DialogTitle>
                            <DialogDescription>
                                View and restore your past transport calculations.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] mt-4">
                            {historyItems.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No saved history found.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {historyItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                            <div>
                                                <div className="font-semibold">
                                                    {new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString()}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {item.inputs.subType === 'vehicle' ? 'Vehicle' : item.inputs.subType === 'flight' ? 'Flight' : 'Freight'} • <span className="font-medium text-primary">{item.result.emissionsTonnes.toFixed(2)} tCO2e</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => handleLoadHistoryItem(item)}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteHistory(item.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Truck className="h-8 w-8 text-blue-500" />
                    Transportation Emissions
                </h1>
                <p className="text-muted-foreground mt-2">
                    Calculate emissions from vehicles, air travel, and freight transport.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                    <TabsTrigger value="flights">Air Travel</TabsTrigger>
                    <TabsTrigger value="freight">Freight</TabsTrigger>
                </TabsList>

                <TabsContent value="vehicles">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal & Fleet Vehicles</CardTitle>
                            <CardDescription>Distance-based calculation for various vehicle types.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Vehicle Type</Label>
                                    <Select value={vehicleType} onValueChange={setVehicleType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="car">Passenger Car</SelectItem>
                                            <SelectItem value="van">Van / Light Truck</SelectItem>
                                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Fuel / Powertrain</Label>
                                    <Select value={vehicleFuel} onValueChange={setVehicleFuel}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gasoline">Gasoline (Petrol)</SelectItem>
                                            <SelectItem value="diesel">Diesel</SelectItem>
                                            <SelectItem value="hybrid">Hybrid (HEV)</SelectItem>
                                            <SelectItem value="electric">Electric (BEV)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Size Class</Label>
                                    <Select value={vehicleSize} onValueChange={setVehicleSize}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="small">Small</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="large">Large</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Annual Distance</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            value={vehicleDistance}
                                            onChange={(e) => setVehicleDistance(Number(e.target.value))}
                                        />
                                        <Select value={vehicleUnit} onValueChange={setVehicleUnit}>
                                            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="km">km</SelectItem>
                                                <SelectItem value="miles">miles</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleVehicleCalculate} className="w-full">Calculate Emissions</Button>
                            {vehicleResult && <CalculationBreakdown result={vehicleResult} type="vehicle" />}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="flights">
                    <Card>
                        <CardHeader>
                            <CardTitle>Air Travel</CardTitle>
                            <CardDescription>Passenger flight emissions with radiative forcing.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Origin (IATA Code)</Label>
                                    <Input value={flightOrigin} onChange={(e) => setFlightOrigin(e.target.value.toUpperCase())} placeholder="e.g. JFK" maxLength={3} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Destination (IATA Code)</Label>
                                    <Input value={flightDest} onChange={(e) => setFlightDest(e.target.value.toUpperCase())} placeholder="e.g. LHR" maxLength={3} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Class</Label>
                                    <Select value={flightClass} onValueChange={setFlightClass}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="economy">Economy</SelectItem>
                                            <SelectItem value="premium_economy">Premium Economy</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="first">First Class</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Passengers</Label>
                                    <Input type="number" value={flightPax} onChange={(e) => setFlightPax(Number(e.target.value))} min={1} />
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="roundTrip" checked={flightRoundTrip} onCheckedChange={(c) => setFlightRoundTrip(!!c)} />
                                    <Label htmlFor="roundTrip">Round Trip</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="rf" checked={flightRF} onCheckedChange={(c) => setFlightRF(!!c)} />
                                    <Label htmlFor="rf">Include Radiative Forcing (Recommended)</Label>
                                </div>
                            </div>

                            <Button onClick={handleFlightCalculate} className="w-full">Calculate Flight Emissions</Button>
                            {flightResult && <CalculationBreakdown result={flightResult} type="flight" />}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="freight">
                    <Card>
                        <CardHeader>
                            <CardTitle>Freight Transport</CardTitle>
                            <CardDescription>Shipment emissions by mode.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>Mode</Label>
                                    <Select value={freightMode} onValueChange={setFreightMode}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="road">Road (Truck)</SelectItem>
                                            <SelectItem value="rail">Rail</SelectItem>
                                            <SelectItem value="sea">Sea (Container)</SelectItem>
                                            <SelectItem value="air">Air Freight</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Weight (Tonnes)</Label>
                                    <Input type="number" value={freightWeight} onChange={(e) => setFreightWeight(Number(e.target.value))} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Distance (km)</Label>
                                    <Input type="number" value={freightDist} onChange={(e) => setFreightDist(Number(e.target.value))} />
                                </div>
                            </div>

                            <Button onClick={handleFreightCalculate} className="w-full">Calculate Freight Emissions</Button>
                            {freightResult && <CalculationBreakdown result={freightResult} type="freight" />}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TransportCalculator;
