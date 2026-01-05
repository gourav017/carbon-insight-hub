import React from 'react';
import { ESGDueDiligenceProvider } from '@/context/ESGDueDiligenceContext';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ESGDueDiligenceLayout = () => {
    return (
        <ESGDueDiligenceProvider>
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ESGDueDiligenceProvider>
    );
};

export default ESGDueDiligenceLayout;
