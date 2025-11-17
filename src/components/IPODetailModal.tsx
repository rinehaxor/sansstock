'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface IPOListing {
  id: number;
  ticker_symbol: string;
  company_name: string;
  ipo_date: string;
  ipo_price: number | null;
  general_sector: string | null;
  specific_sector: string | null;
  shares_offered: number | null;
  total_value: number | null;
  assets_growth_1y: number | null;
  liabilities_growth_1y: number | null;
  revenue_growth_1y: number | null;
  net_income_growth_1y: number | null;
  lead_underwriter: string | null;
  accounting_firm: string | null;
  ipo_performance_metrics?: Array<{
    metric_name: string;
    metric_value: number;
    period_days: number;
  }>;
}

interface IPODetailModalProps {
  ipo: IPOListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function IPODetailModal({ ipo, isOpen, onClose }: IPODetailModalProps) {
  if (!ipo) return null;

  const formatCurrency = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercent = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '-';
    }
    return `${Number(value).toFixed(2)}%`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getPeriodLabel = (days: number): string => {
    if (days === 1) return 'Hari 1';
    if (days === 7) return 'Minggu 1';
    if (days === 30) return 'Bulan 1';
    if (days === 90) return 'Bulan 3';
    if (days === 180) return 'Bulan 6';
    if (days === 365) return 'Tahun 1';
    return `${days} hari`;
  };

  const metrics = ipo.ipo_performance_metrics || [];
  const sortedMetrics = [...metrics].sort((a, b) => a.period_days - b.period_days);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-xl shadow-md">
              {ipo.ticker_symbol}
            </span>
            <span className="text-gray-900">{ipo.company_name}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Detail lengkap informasi IPO dan performa saham
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* IPO Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informasi IPO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Tanggal IPO</div>
                <div className="text-base font-semibold text-gray-900">{formatDate(ipo.ipo_date)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Harga IPO</div>
                <div className="text-base font-semibold text-gray-900">{formatCurrency(ipo.ipo_price)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Saham yang Ditawarkan</div>
                <div className="text-base font-semibold text-gray-900">{formatNumber(ipo.shares_offered)} lembar</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Nilai IPO</div>
                <div className="text-base font-semibold text-gray-900">{formatCurrency(ipo.total_value)}</div>
              </div>
            </div>
          </div>

          {/* Sector Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Informasi Sektor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Sektor Umum</div>
                <div className="text-base font-semibold text-gray-900">{ipo.general_sector || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Sektor Spesifik</div>
                <div className="text-base font-semibold text-gray-900">{ipo.specific_sector || '-'}</div>
              </div>
            </div>
          </div>

          {/* Financial Growth */}
          {(ipo.assets_growth_1y !== null || ipo.liabilities_growth_1y !== null || 
            ipo.revenue_growth_1y !== null || ipo.net_income_growth_1y !== null) && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Pertumbuhan Keuangan 1 Tahun
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ipo.assets_growth_1y !== null && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Pertumbuhan Aset</div>
                    <div className={`text-base font-semibold ${ipo.assets_growth_1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(ipo.assets_growth_1y)}
                    </div>
                  </div>
                )}
                {ipo.liabilities_growth_1y !== null && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Pertumbuhan Liabilitas</div>
                    <div className={`text-base font-semibold ${ipo.liabilities_growth_1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(ipo.liabilities_growth_1y)}
                    </div>
                  </div>
                )}
                {ipo.revenue_growth_1y !== null && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Pertumbuhan Pendapatan</div>
                    <div className={`text-base font-semibold ${ipo.revenue_growth_1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(ipo.revenue_growth_1y)}
                    </div>
                  </div>
                )}
                {ipo.net_income_growth_1y !== null && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Pertumbuhan Laba Bersih</div>
                    <div className={`text-base font-semibold ${ipo.net_income_growth_1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(ipo.net_income_growth_1y)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          {sortedMetrics.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Performa Harga Saham
              </h3>
              <div className="space-y-2">
                {sortedMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-700">{getPeriodLabel(metric.period_days)}</div>
                      <div className="text-xs text-gray-500">{metric.metric_name}</div>
                    </div>
                    <div className={`text-lg font-bold ${metric.metric_value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.metric_value >= 0 ? '+' : ''}{metric.metric_value.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supporting Professionals */}
          {(ipo.lead_underwriter || ipo.accounting_firm) && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Profesi Penunjang
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ipo.lead_underwriter && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Lead Underwriter</div>
                    <div className="text-base font-semibold text-gray-900">{ipo.lead_underwriter}</div>
                  </div>
                )}
                {ipo.accounting_firm && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Kantor Akuntan</div>
                    <div className="text-base font-semibold text-gray-900">{ipo.accounting_firm}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

