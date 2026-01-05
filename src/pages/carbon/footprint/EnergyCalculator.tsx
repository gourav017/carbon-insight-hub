import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, Flame, ArrowLeft, History, Save, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GRID_REGIONS } from '../../../lib/carbon/sectors/factors';
import { calculateElectricity, calculateFuel } from '../../../lib/carbon/sectors/energy';
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

const EnergyCalculator = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('electricity');
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyItems, setHistoryItems] = useState<FootprintHistoryItem[]>([]);

    // Electricity State
    const [elecUsage, setElecUsage] = useState<number>(0);
    const [elecUnit, setElecUnit] = useState<'kWh' | 'MWh'>('kWh');
    const [gridRegion, setGridRegion] = useState<string>('');
    const [elecResult, setElecResult] = useState<CalculationResult | null>(null);

    // Fuel State
    const [fuelType, setFuelType] = useState<string>('natural_gas');
    const [fuelUnit, setFuelUnit] = useState<string>('m3');
    const [fuelAmount, setFuelAmount] = useState<number>(0);
    const [fuelResult, setFuelResult] = useState<CalculationResult | null>(null);

    const handleElecCalculate = () => {
        if (!gridRegion) return;
        const result = calculateElectricity({
            usage: elecUsage,
            unit: elecUnit,
            gridRegion
        });
        setElecResult(result);
    };

    const handleFuelCalculate = () => {
        const result = calculateFuel({
            // @ts-ignore
            type: fuelType,
            amount: fuelAmount,
            unit: fuelUnit
        });
        setFuelResult(result);
    };

    const handleSaveHistory = (type: 'electricity' | 'fuel') => {
        if (type === 'electricity' && elecResult) {
            saveToHistory('energy', { usage: elecUsage, unit: elecUnit, gridRegion, subType: 'electricity' }, elecResult);
            toast({ title: "Saved", description: "Electricity calculation saved to history." });
        } else if (type === 'fuel' && fuelResult) {
            saveToHistory('energy', { type: fuelType, amount: fuelAmount, unit: fuelUnit, subType: 'fuel' }, fuelResult);
            toast({ title: "Saved", description: "Fuel calculation saved to history." });
        }
        loadHistory();
    };

    const loadHistory = () => {
        setHistoryItems(getHistoryByType('energy'));
    };

    const handleDeleteHistory = (id: string) => {
        deleteFromHistory(id);
        loadHistory();
    };

    const handleLoadHistoryItem = (item: FootprintHistoryItem) => {
        if (item.inputs.subType === 'electricity') {
            setActiveTab('electricity');
            setElecUsage(item.inputs.usage);
            setElecUnit(item.inputs.unit);
            setGridRegion(item.inputs.gridRegion);
            setElecResult(item.result);
        } else if (item.inputs.subType === 'fuel') {
            setActiveTab('fuels');
            setFuelType(item.inputs.type);
            setFuelAmount(item.inputs.amount);
            setFuelUnit(item.inputs.unit);
            setFuelResult(item.result);
        }
        setHistoryOpen(false);
    };

    const CalculationBreakdown = ({ result, type }: { result: CalculationResult, type: 'electricity' | 'fuel' }) => (
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
                            <DialogTitle>Energy Calculation History</DialogTitle>
                            <DialogDescription>
                                View and restore your past energy calculations.
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
                                                    {item.inputs.subType === 'electricity' ? 'Electricity' : 'Fuel'} • <span className="font-medium text-primary">{item.result.emissionsTonnes.toFixed(2)} tCO2e</span>
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
                    <Zap className="h-8 w-8 text-yellow-500" />
                    Energy Consumption Calculator
                </h1>
                <p className="text-muted-foreground mt-2">
                    Calculate emissions from electricity and fuel combustion using region-specific factors.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="electricity">Electricity</TabsTrigger>
                    <TabsTrigger value="fuels">Fuels (Gas, Diesel, Coal)</TabsTrigger>
                </TabsList>

                <TabsContent value="electricity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Electricity Consumption</CardTitle>
                            <CardDescription>Enter your annual usage and select your grid region.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Annual Usage</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            value={elecUsage}
                                            onChange={(e) => setElecUsage(Number(e.target.value))}
                                            placeholder="e.g. 50000"
                                        />
                                        <Select value={elecUnit} onValueChange={(v: any) => setElecUnit(v)}>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="kWh">kWh</SelectItem>
                                                <SelectItem value="MWh">MWh</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Grid Region</Label>
                                    <Select value={gridRegion} onValueChange={setGridRegion}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a region..." />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {GRID_REGIONS.map(region => (
                                                <SelectItem key={region.id} value={region.id}>
                                                    {region.name} ({region.factor} kg/kWh)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button onClick={handleElecCalculate} className="w-full">Calculate Emissions</Button>

                            {elecResult && <CalculationBreakdown result={elecResult} type="electricity" />}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="fuels">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fuel Combustion</CardTitle>
                            <CardDescription>Calculate emissions from stationary combustion sources.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>Fuel Type</Label>
                                    <Select value={fuelType} onValueChange={setFuelType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="natural_gas">Natural Gas</SelectItem>
                                            <SelectItem value="diesel">Diesel</SelectItem>
                                            <SelectItem value="petrol">Petrol</SelectItem>
                                            <SelectItem value="lpg">LPG</SelectItem>
                                            <SelectItem value="coal">Coal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Unit</Label>
                                    <Select value={fuelUnit} onValueChange={setFuelUnit}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fuelType === 'natural_gas' && (
                                                <>
                                                    <SelectItem value="m3">Cubic Meters (m³)</SelectItem>
                                                    <SelectItem value="ft3">Cubic Feet (ft³)</SelectItem>
                                                    <SelectItem value="therm">Therms</SelectItem>
                                                </>
                                            )}
                                            {(fuelType === 'diesel' || fuelType === 'petrol' || fuelType === 'lpg') && (
                                                <>
                                                    <SelectItem value="liter">Liters</SelectItem>
                                                    <SelectItem value="gallon_us">Gallons (US)</SelectItem>
                                                </>
                                            )}
                                            {fuelType === 'coal' && (
                                                <SelectItem value="bituminous">Tonnes (Bituminous)</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Amount</Label>
                                    <Input
                                        type="number"
                                        value={fuelAmount}
                                        onChange={(e) => setFuelAmount(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <Button onClick={handleFuelCalculate} className="w-full">Calculate Emissions</Button>

                            {fuelResult && <CalculationBreakdown result={fuelResult} type="fuel" />}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default EnergyCalculator;
