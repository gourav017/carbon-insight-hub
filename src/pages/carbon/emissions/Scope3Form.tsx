import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Scope3Data } from "@/types/carbon";

const CATEGORIES = [
    { id: 1, name: "Purchased Goods & Services" },
    { id: 2, name: "Capital Goods" },
    { id: 3, name: "Fuel- & Energy-Related Activities" },
    { id: 4, name: "Upstream Transportation & Distribution" },
    { id: 5, name: "Waste Generated in Operations" },
    { id: 6, name: "Business Travel" },
    { id: 7, name: "Employee Commuting" },
    { id: 8, name: "Upstream Leased Assets" },
    { id: 9, name: "Downstream Transportation & Distribution" },
    { id: 10, name: "Processing of Sold Products" },
    { id: 11, name: "Use of Sold Products" },
    { id: 12, name: "End-of-Life Treatment of Sold Products" },
    { id: 13, name: "Downstream Leased Assets" },
    { id: 14, name: "Franchises" },
    { id: 15, name: "Investments" },
];

const Scope3Form = () => {
    const navigate = useNavigate();
    const [materialCategories, setMaterialCategories] = useState<number[]>([1, 6, 7]); // Default common ones

    const { register, control, handleSubmit } = useForm<Scope3Data>({
        defaultValues: {
            categories: CATEGORIES.map(c => ({
                id: crypto.randomUUID(),
                category: c.id,
                name: c.name,
                method: "spend",
                emissions: 0,
                inputData: { spend: 0 }
            })),
            materialCategories: [1, 6, 7]
        }
    });

    const { fields } = useFieldArray({
        control,
        name: "categories"
    });

    const toggleMateriality = (id: number) => {
        if (materialCategories.includes(id)) {
            setMaterialCategories(prev => prev.filter(c => c !== id));
        } else {
            setMaterialCategories(prev => [...prev, id]);
        }
    };

    const onSubmit = (data: Scope3Data) => {
        // Filter out non-material categories or flag them
        const finalData = {
            ...data,
            materialCategories
        };
        console.log(finalData);
        navigate("/carbon-emissions/results");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Scope 3: Value Chain</h1>
                    <p className="text-muted-foreground mb-8">
                        Assess indirect emissions from upstream and downstream activities.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        {/* Materiality Assessment */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Materiality Assessment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Select the categories that are relevant to your business operations.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {CATEGORIES.map((cat) => (
                                        <div key={cat.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-secondary/10">
                                            <Checkbox
                                                id={`cat-${cat.id}`}
                                                checked={materialCategories.includes(cat.id)}
                                                onCheckedChange={() => toggleMateriality(cat.id)}
                                            />
                                            <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer flex-1">
                                                <span className="font-semibold mr-2">{cat.id}.</span>
                                                {cat.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Input */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Input</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {fields.map((field, index) => {
                                        if (!materialCategories.includes(field.category)) return null;

                                        return (
                                            <AccordionItem key={field.id} value={field.id}>
                                                <AccordionTrigger>
                                                    <div className="flex items-center gap-4">
                                                        <span>{field.category}. {field.name}</span>
                                                        <Badge variant="outline">Spend-based</Badge>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4 space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label>Annual Spend ($)</Label>
                                                            <Input
                                                                type="number"
                                                                {...register(`categories.${index}.inputData.spend`, { valueAsNumber: true })}
                                                                placeholder="Enter amount"
                                                            />
                                                            <p className="text-xs text-muted-foreground">
                                                                Estimate total spend for this category to apply EEIO factors.
                                                            </p>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Manual Emissions Override (tCO2e)</Label>
                                                            <Input
                                                                type="number"
                                                                {...register(`categories.${index}.emissions`, { valueAsNumber: true })}
                                                                placeholder="Optional"
                                                            />
                                                            <p className="text-xs text-muted-foreground">
                                                                If you have supplier-specific data, enter the total here.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>

                                {materialCategories.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No categories selected. Please select material categories above.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={() => navigate("/carbon-emissions/scope2")}>Back</Button>
                            <Button type="submit" size="lg">Calculate Results</Button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Scope3Form;
