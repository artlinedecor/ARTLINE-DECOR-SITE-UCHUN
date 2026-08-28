'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Download, Printer, Ruler, Save, User, Phone, MapPin, Grid, PlusCircle, ArrowRight, Table } from 'lucide-react';
import { calculateEstimate, generateModelCode } from '@/lib/calculator';
import { generateEstimatePDF } from '@/lib/pdf-generator';
import { generateId, getPricing, savePricing } from '@/lib/store';
import type { CalculatorInput, CalculatorResult, Order } from '@/lib/types';
import { saveOrderClient } from '@/lib/orders-sync';
import toast from 'react-hot-toast';

export default function ZamerPage() {
  const [elements, setElements] = useState<any[]>([]);
  const [inputs, setInputs] = useState<CalculatorInput[]>([
    {
      elementType: 'cornice',
      length: 2.0,
      width: 0.30,
      height: 0.12,
      quantity: 10,
    }
  ]);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [clientName, setClientName] = useState('');
   const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [saved, setSaved] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [usdToUzsRate, setUsdToUzsRate] = useState(12650);
  const [globalCostPerCubic, setGlobalCostPerCubic] = useState(250);

  // Image Upload States
  const [objectImages, setObjectImages] = useState<string[]>([]);
  const [calcImages, setCalcImages] = useState<string[]>([]);

  useEffect(() => {
    // 1. Load from localStorage immediately (sync — shows instantly)
    const localPricing = getPricing();
    const applyPricing = (pricing: typeof localPricing) => {
      if (pricing.usdToUzsRate) setUsdToUzsRate(pricing.usdToUzsRate);
      if (pricing.pricePerCubicMeter) setGlobalCostPerCubic(pricing.pricePerCubicMeter);
      if (pricing.elements && pricing.elements.length > 0) {
        setElements(pricing.elements);
        const defaultEl = pricing.elements[0];
        const autoModel = generateModelCode(defaultEl.id, defaultEl.height || 0.12, defaultEl.width || 0.30);
        setInputs([
          {
            elementType: defaultEl.id,
            model: autoModel || '',
            length: defaultEl.defaultLength || 2.0,
            width: defaultEl.width || 0.30,
            height: defaultEl.height || 0.12,
            quantity: 10,
            pieceLength: defaultEl.defaultLength || 2.0,
          }
        ]);
      }
    };

    applyPricing(localPricing); // apply immediately from localStorage

    // 2. Then try server — if server has MORE elements, merge and update
    fetch('/api/config')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.config?.elements && data.config.elements.length > 0) {
          const serverPricing = { ...localPricing, ...data.config };
          // Only update if server has different/more elements
          const serverIds = new Set<string>(serverPricing.elements.map((e: { id: string }) => e.id));
          const localIds = new Set<string>(localPricing.elements.map(e => e.id));
          const hasNew = [...serverIds].some(id => !localIds.has(id));
          if (hasNew) {
            savePricing(serverPricing);
            applyPricing(serverPricing);
          }
        }
      })
      .catch(() => { /* server unavailable, localStorage is enough */ });
  }, []);



  // Run calculation automatically whenever inputs change
  useEffect(() => {
    if (inputs.length > 0 && elements.length > 0) {
      try {
        const res = calculateEstimate(inputs, globalCostPerCubic, usdToUzsRate);
        setResult(res);
      } catch (err) {
        console.error("Calculation error", err);
      }
    } else {
      setResult(null);
    }
  }, [inputs, elements, globalCostPerCubic, usdToUzsRate]);

  // Image compressor
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'object' | 'calc') => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          const compressed = await compressImage(base64);
          if (type === 'object') {
            setObjectImages((prev) => [...prev, compressed]);
          } else {
            setCalcImages((prev) => [...prev, compressed]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const updateInput = (idx: number, field: keyof CalculatorInput, value: any) => {
    setInputs(prev => {
      const next = [...prev];
      
      const oldH = Number(next[idx].height || 0);
      const oldW = Number(next[idx].width || 0);
      const oldAutoModel = generateModelCode(next[idx].elementType, oldH, oldW);
      
      // If changing product type, auto-fill standard dimensions
      if (field === 'elementType') {
        const selectedProd = elements.find(el => el.id === value);
        if (selectedProd) {
          const autoModel = generateModelCode(value, selectedProd.height || 0.12, selectedProd.width || 0.30);
          next[idx] = {
            ...next[idx],
            elementType: value,
            model: autoModel || '',
            length: selectedProd.defaultLength || 2.0,
            width: selectedProd.width || 0.30,
            height: selectedProd.height || 0.12,
            pieceLength: selectedProd.defaultLength || 2.0,
          };
          return next;
        }
      }

      next[idx] = { ...next[idx], [field]: value };

      if (field === 'height' || field === 'width') {
        const newH = Number(next[idx].height || 0);
        const newW = Number(next[idx].width || 0);
        const newAutoModel = generateModelCode(next[idx].elementType, newH, newW);
        const currentModel = next[idx].model || '';
        
        if (currentModel === '' || currentModel === oldAutoModel) {
          next[idx].model = newAutoModel;
        }
      }
      
      return next;
    });
  };

  const addItem = () => {
    const defaultType = elements[0]?.id || 'cornice';
    const selectedProd = elements.find(el => el.id === defaultType);
    const defaultH = selectedProd?.height || 0.12;
    const defaultW = selectedProd?.width || 0.30;
    const autoModel = generateModelCode(defaultType, defaultH, defaultW);
    setInputs(prev => [...prev, {
      elementType: defaultType,
      model: autoModel || '',
      length: selectedProd?.defaultLength || 2.0,
      width: defaultW,
      height: defaultH,
      quantity: 10,
      pieceLength: selectedProd?.defaultLength || 2.0,
    }]);
  };

  const removeItem = (idx: number) => {
    if (inputs.length <= 1) {
      toast.error("Kamida bitta qator bo'lishi shart!");
      return;
    }
    setInputs(prev => prev.filter((_, i) => i !== idx));
  };

  // Keyboard navigation inside spreadsheet
  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    const maxRows = inputs.length;
    const maxCols = 7; // columns: product, model, pieceLength, height, width, length, customPrice

    let nextRow = rowIndex;
    let nextCol = colIndex;

    if (e.key === 'ArrowUp') {
      nextRow = Math.max(0, rowIndex - 1);
    } else if (e.key === 'ArrowDown') {
      nextRow = Math.min(maxRows - 1, rowIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      nextCol = Math.max(0, colIndex - 1);
    } else if (e.key === 'ArrowRight') {
      nextCol = Math.min(maxCols - 1, colIndex + 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // If Enter is pressed on the last row and column, automatically add a new row
      if (rowIndex === maxRows - 1 && colIndex === 6) {
        addItem();
        setTimeout(() => {
          const nextEl = document.querySelector(`.grid-cell-${rowIndex + 1}-0`) as HTMLElement;
          nextEl?.focus();
        }, 50);
        return;
      } else {
        nextRow = Math.min(maxRows - 1, rowIndex + 1);
      }
    } else {
      return; // Let default browser action take place
    }

    e.preventDefault();
    const nextEl = document.querySelector(`.grid-cell-${nextRow}-${nextCol}`) as HTMLElement;
    nextEl?.focus();
  };

  const handleSaveToKanban = async () => {
    if (!result || !clientName || !clientPhone) {
      toast.error("Mijoz ismi va telefon raqami kiritilishi shart!");
      return;
    }
    const order: Order = {
      id: generateId(),
      clientName,
      phone: clientPhone,
      address: clientAddress,
      status: 'measurement',
      items: result.items.map((item, idx) => {
        const correspondingInput = inputs[idx];
        const selectedProd = elements.find(e => e.id === item.elementType);
        const defaultL = correspondingInput?.pieceLength !== undefined && correspondingInput?.pieceLength !== ""
          ? Number(correspondingInput.pieceLength)
          : (selectedProd?.defaultLength || 2.0);
        const w = correspondingInput?.width !== undefined && correspondingInput?.width !== ""
          ? Number(correspondingInput.width)
          : (selectedProd?.width || 0.30);
        const h = correspondingInput?.height !== undefined && correspondingInput?.height !== ""
          ? Number(correspondingInput.height)
          : (selectedProd?.height || 0.12);
        return {
          id: generateId(),
          elementType: item.elementType,
          name: item.name,
          length: Number(correspondingInput?.length) || 2.0,
          width: w,
          height: h,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          pieceLength: defaultL,
        };
      }),
      totalPrice: result.total,
      notes: 'Zamer kalkulyatori orqali yaratildi',
      objectImages,
      calcImages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await saveOrderClient(order);
      setSaved(true);
      toast.success("Mijoz va hisob-kitob Kanban taxtasiga (Zamer bosqichi) saqlandi!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      toast.error("Saqlashda xatolik yuz berdi!");
    }

    // Send Telegram notification
    fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    }).catch(() => {});
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    setPdfLoading(true);
    await generateEstimatePDF(result, clientName ? {
      name: clientName, phone: clientPhone, address: clientAddress,
    } : undefined, inputs);
    setPdfLoading(false);
  };

  const handleExportExcel = () => {
    if (!result) return;
    
    const headers = ["Mahsulot", "O'lchamlari", "Soni", "O'lchov birligi", "Birlik Narxi (So'm)", "Jami Narxi (So'm)"];
    const rows = result.items.map(item => [
      item.name,
      item.dimensions,
      item.quantity,
      item.unitPrice === 0 ? '' : 'dona',
      item.unitPrice,
      item.totalPrice
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smeta_${clientName || 'mijoz'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel (CSV) fayli yuklab olindi!");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .glass-card {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin-bottom: 20px !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          table th, table td {
            border: 1px solid #000 !important;
            color: #000 !important;
            padding: 8px !important;
            font-size: 11px !important;
          }
          .print-title {
            text-align: center !important;
            margin-bottom: 20px !important;
          }
        }
      `}} />

      {/* Header */}
      <div className="dash-header no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-glow)', border: '1px solid var(--border-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-gold)',
          }}>
            <Ruler size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', lineHeight: 1 }}>Smeta Kalkulyatori</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 3 }}>
              Eksel kabi interaktiv jadval orqali o&apos;lchamlarni kiriting. Hisob-kitob real vaqtda amalga oshadi.
            </p>
          </div>
        </div>

        {result && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {saved && (
              <span className="badge badge-success" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                ✓ Zamer Kanbaniga Saqlandi
              </span>
            )}
            <button className="btn btn-ghost btn-sm" onClick={handleExportExcel}>
              <Table size={15} /> CSV (Excel)
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleDownloadPDF} disabled={pdfLoading}>
              <Download size={15} /> {pdfLoading ? 'Yuklanmoqda...' : 'PDF'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
              <Printer size={15} /> Chop etish
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSaveToKanban}>
              <Save size={15} /> Kanban&apos;ga saqlash
            </button>
          </div>
        )}
      </div>

      {/* Print only header */}
      <div className="print-only" style={{ display: 'none' }}>
        <div className="print-title">
          <h1 style={{ fontSize: '24px', margin: '0 0 4px 0' }}>ARTLINE DECOR</h1>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Fasad Bezaklari va Termo panellar Smeta Hujjati</p>
          <hr style={{ border: 'none', borderBottom: '1px solid #ccc', margin: '15px 0' }} />
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: 24 }} className="no-print">
        {/* LEFT — Interactive Spreadsheet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Client info */}
          <div className="glass-card">
            <h3 style={{ fontSize: '0.95rem', marginBottom: 16, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} /> Mijoz ma&apos;lumotlari (Kanbanga saqlash uchun)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Mijoz Ism Familiyasi *</label>
                  <input className="input-field" placeholder="Masalan: Elyor aka" value={clientName}
                    onChange={e => setClientName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Telefon raqami *</label>
                  <input className="input-field" placeholder="+998 (90) 123-45-67" value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Obyekt Manzili</label>
                  <input className="input-field" placeholder="Masalan: Chilonzor 9-daha" value={clientAddress}
                    onChange={e => setClientAddress(e.target.value)} />
                </div>
              </div>
            </div>
          </div>


          {/* Spreadsheet Table Card */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Grid size={16} style={{ color: 'var(--accent-gold)' }} />
                Interactive Smeta Jadvali
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Qatorlar orasida ↑ ↓ Enter orqali harakatlanishingiz mumkin.
              </span>
            </div>

            <div className="spreadsheet-scroll-container">
              <table className="spreadsheet-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ width: 40, padding: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>#</th>
                    <th style={{ padding: 12, textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Element Turi (Mahsulot)</th>
                    <th style={{ width: 120, padding: 12, textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Model / Nomi</th>
                    <th style={{ width: 90, padding: 12, textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Uzunligi (m)</th>
                    <th style={{ width: 90, padding: 12, textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Bo'rtishi (sm)</th>
                    <th style={{ width: 90, padding: 12, textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Yuzasi (sm)</th>
                    <th style={{ width: 110, padding: 12, textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Buyurtma Metri</th>
                    <th style={{ width: 120, padding: 12, textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>1m Narxi (so'm)</th>
                    <th style={{ width: 120, padding: 12, textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Jami (so'm)</th>
                    <th style={{ width: 50, padding: 12, textAlign: 'center', color: 'var(--text-muted)' }}>X</th>
                  </tr>
                </thead>
                <tbody>
                  {inputs.map((input, idx) => {
                    const elMeta = elements.find(e => e.id === input.elementType);
                    const isVol = elMeta ? elMeta.calculationType === 'volume' : true;
                    
                    // Calculate standard unit price (per meter or per piece) to show as placeholder
                    let standardPrice = 0;
                    if (elMeta) {
                      const costPerCubic = (input.usdPrice !== undefined && input.usdPrice !== "" && Number(input.usdPrice) >= 0)
                        ? Number(input.usdPrice)
                        : globalCostPerCubic;
                      const basePriceUSD = (input.usdPrice !== undefined && input.usdPrice !== "" && Number(input.usdPrice) >= 0)
                        ? Number(input.usdPrice)
                        : (elMeta.pricePerUnit || 0);

                      if (elMeta.calculationType === 'volume') {
                        const w = Number(input.width) || elMeta.width || 0;
                        const h = Number(input.height) || elMeta.height || 0;
                        standardPrice = Math.round(w * h * 1 * costPerCubic * usdToUzsRate);
                      } else {
                        standardPrice = Math.round(basePriceUSD * usdToUzsRate);
                      }
                    }
                    
                    const defaultL = elMeta?.defaultLength || 2.0;
                    const displayWidth = input.width === '' ? '' : Math.round(Number(input.width) * 100);
                    const displayHeight = input.height === '' ? '' : Math.round(Number(input.height) * 100);
                    const resultItem = result?.items[idx];
                    const rowUnitPrice = resultItem ? resultItem.unitPrice : standardPrice;
                    const rowTotalPrice = resultItem ? resultItem.totalPrice : 0;

                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: 'transparent' }} className="spreadsheet-row">
                        <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{idx + 1}</td>
                        <td style={{ padding: 6 }}>
                          <select 
                            className={`grid-input grid-cell-select grid-cell-${idx}-0`} 
                            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', color: '#fff', fontSize: '0.88rem' }}
                            value={input.elementType}
                            onChange={e => updateInput(idx, 'elementType', e.target.value)}
                            onKeyDown={e => handleKeyDown(e, idx, 0)}
                          >
                            {elements.map(el => (
                              <option key={el.id} value={el.id} style={{ background: '#0a0d18', color: '#fff' }}>
                                {el.nameUz} ({el.unit})
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* Model / Nomi */}
                        <td style={{ padding: 4 }}>
                          <input 
                            type="text" 
                            className={`grid-input grid-cell-${idx}-1`}
                            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', color: '#fff', fontSize: '0.88rem', padding: 4 }}
                            placeholder={resultItem ? resultItem.name : ''}
                            value={input.model || ''} 
                            onChange={e => updateInput(idx, 'model', e.target.value)}
                            onKeyDown={e => handleKeyDown(e, idx, 1)}
                          />
                        </td>
                        {/* Uzunligi (m) */}
                        <td style={{ padding: 4 }}>
                          <input 
                            type="number" 
                            step="0.1"
                            className={`grid-input grid-cell-${idx}-2`}
                            style={{ width: '100%', textAlign: 'center', border: 'none', background: 'transparent', outline: 'none', color: '#fff', fontFamily: 'var(--font-mono)', padding: 4 }}
                            value={input.pieceLength !== undefined && input.pieceLength !== "" ? input.pieceLength : (elMeta?.defaultLength || '')} 
                            onChange={e => updateInput(idx, 'pieceLength', e.target.value === '' ? '' : Number(e.target.value))}
                            onKeyDown={e => handleKeyDown(e, idx, 2)}
                          />
                        </td>
                        {/* Bo'rtishi (sm) */}
                        <td style={{ padding: 4 }}>
                          <input 
                            type="number" 
                            className={`grid-input grid-cell-${idx}-3`}
                            style={{ width: '100%', textAlign: 'right', border: 'none', background: 'transparent', outline: 'none', color: '#fff', fontFamily: 'var(--font-mono)', padding: 4 }}
                            value={displayHeight} 
                            onChange={e => updateInput(idx, 'height', e.target.value === '' ? '' : +e.target.value / 100)}
                            onKeyDown={e => handleKeyDown(e, idx, 3)}
                          />
                        </td>
                        {/* Yuzasi (sm) */}
                        <td style={{ padding: 4 }}>
                          <input 
                            type="number" 
                            className={`grid-input grid-cell-${idx}-4`}
                            style={{ width: '100%', textAlign: 'right', border: 'none', background: 'transparent', outline: 'none', color: '#fff', fontFamily: 'var(--font-mono)', padding: 4 }}
                            value={displayWidth} 
                            onChange={e => updateInput(idx, 'width', e.target.value === '' ? '' : +e.target.value / 100)}
                            onKeyDown={e => handleKeyDown(e, idx, 4)}
                          />
                        </td>
                        {/* Buyurtma Metri */}
                        <td style={{ padding: 4 }}>
                          <input 
                            type="number" 
                            className={`grid-input grid-cell-${idx}-5`}
                            style={{ width: '100%', textAlign: 'right', border: 'none', background: 'transparent', outline: 'none', color: '#fff', fontFamily: 'var(--font-mono)', padding: 4 }}
                            value={input.length} 
                            onChange={e => updateInput(idx, 'length', e.target.value === '' ? '' : +e.target.value)}
                            onKeyDown={e => handleKeyDown(e, idx, 5)}
                          />
                        </td>
                        {/* 1m / Dona narxi */}
                        <td style={{ padding: 4 }}>
                          <input 
                            type="number" 
                            className={`grid-input grid-cell-${idx}-6`}
                            style={{ width: '100%', textAlign: 'right', border: 'none', background: 'transparent', outline: 'none', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)', padding: 4 }}
                            value={input.customPrice !== undefined ? input.customPrice : ''} 
                            placeholder={rowUnitPrice.toString()}
                            onChange={e => updateInput(idx, 'customPrice', e.target.value === '' ? '' : Number(e.target.value))}
                            onKeyDown={e => handleKeyDown(e, idx, 6)}
                          />
                        </td>
                        {/* Jami narx (row total) */}
                        <td style={{ textAlign: 'right', padding: '6px 12px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#fff', fontWeight: 'bold' }}>
                          {rowTotalPrice.toLocaleString()}&nbsp;so&apos;m
                        </td>
                        <td style={{ textAlign: 'center', padding: 4 }}>
                          <button onClick={() => removeItem(idx)} className="btn btn-ghost" style={{ padding: 6, color: 'var(--error)' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ padding: 12, display: 'flex', gap: 12, background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost btn-sm" onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-gold)' }}>
                <PlusCircle size={14} />
                Qator qo&apos;shish (Enter)
              </button>
            </div>
          </div>

          {/* Image uploads */}
          <div className="glass-card">
            <h3 style={{ fontSize: '0.95rem', marginBottom: 16, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Ruler size={16} /> Obyekt chizmalari va loyiha rasmlari
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.82rem', display: 'block', marginBottom: 8 }}>Obyekt rasmlari ({objectImages.length})</label>
                <div style={{ border: '1px dashed var(--border)', padding: 12, textAlign: 'center', borderRadius: 8, cursor: 'pointer' }}
                  onClick={() => document.getElementById('obj-file')?.click()}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yuklash uchun bosing</span>
                  <input id="obj-file" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, 'object')} />
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  {objectImages.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: 50, height: 50, border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="Rasm" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', cursor: 'pointer', fontSize: 9 }}
                        onClick={() => setObjectImages(p => p.filter((_, i) => i !== idx))}>×</button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '0.82rem', display: 'block', marginBottom: 8 }}>Chizmalar / Zamer qog&apos;ozlari ({calcImages.length})</label>
                <div style={{ border: '1px dashed var(--border)', padding: 12, textAlign: 'center', borderRadius: 8, cursor: 'pointer' }}
                  onClick={() => document.getElementById('calc-file')?.click()}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yuklash uchun bosing</span>
                  <input id="calc-file" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, 'calc')} />
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  {calcImages.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: 50, height: 50, border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="Rasm" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', cursor: 'pointer', fontSize: 9 }}
                        onClick={() => setCalcImages(p => p.filter((_, i) => i !== idx))}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Live Bill of Materials / Totals */}
        <div style={{ position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
          <div className="calc-result" style={{ border: '1px solid var(--border-gold)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Table size={18} /> Smeta Natijasi (Real Vaqtda)
            </h3>

            {!result ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p>Qatorlar qo&apos;shing va ma&apos;lumotlarni to&apos;ldiring.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, maxHeight: 320, overflowY: 'auto' }}>
                  {result.items.map((item, idx) => {
                    const elMeta = elements.find(e => e.id === item.elementType);
                    const inputVal = inputs[idx] || { length: 0 };
                    return (
                      <div key={idx} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
                        fontSize: '0.85rem',
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{idx + 1}. {item.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 2 }}>
                            {item.unitPrice.toLocaleString()}&nbsp;so&apos;m × {item.quantity}&nbsp;{elMeta?.unit || 'm'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', fontWeight: 700 }}>
                            {item.totalPrice.toLocaleString()}&nbsp;so&apos;m
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Jami elementlar:</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{result.items.length} turdagi</span>
                  </div>
                  <div className="calc-total-row grand" style={{ borderTop: 'none', paddingTop: 8, marginTop: 0, fontSize: '1.4rem' }}>
                    <span>JAMI:</span>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>{result.total.toLocaleString()}&nbsp;so&apos;m</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
                  {clientName && clientPhone ? (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={handleSaveToKanban}
                    >
                      <Save size={16} /> Kanban taxtasiga saqlash
                    </button>
                  ) : (
                    <div style={{
                      padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)',
                      fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center',
                    }}>
                      Kanbanga saqlash uchun mijoz ism va telefonini kiriting.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* PRINT LAYOUT (Only visible during printing) */}
      <div className="print-only" style={{ display: 'none' }}>
        <div className="glass-card" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Buyurtmachi Ma&apos;lumotlari:</h3>
          <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>F.I.Sh:</strong> {clientName || '_________________________'}</p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Telefon:</strong> {clientPhone || '_________________________'}</p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Manzil:</strong> {clientAddress || '_________________________'}</p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Sana:</strong> {new Date().toLocaleDateString('uz-UZ')}</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: 8, textAlign: 'center', width: 30 }}>#</th>
              <th style={{ border: '1px solid #000', padding: 8, textAlign: 'left' }}>Mahsulot Nomi</th>
              <th style={{ border: '1px solid #000', padding: 8, textAlign: 'center', width: 80 }}>Uzunligi (m)</th>
              <th style={{ border: '1px solid #000', padding: 8, textAlign: 'center', width: 85 }}>Bo&apos;rtishi (sm)</th>
              <th style={{ border: '1px solid #000', padding: 8, textAlign: 'center', width: 85 }}>Yuzasi (sm)</th>
              <th style={{ border: '1px solid #000', padding: 8, textAlign: 'right', width: 100 }}>Buyurtma Metri</th>
              <th style={{ border: '1px solid #000', padding: 8, textAlign: 'right', width: 110 }}>1m / Dona narxi</th>
              <th style={{ border: '1px solid #000', padding: 8, textAlign: 'right', width: 120 }}>Jami Narxi</th>
            </tr>
          </thead>
          <tbody>
            {result?.items.map((item, idx) => {
              const elMeta = elements.find(el => el.id === item.elementType);
              const isVol = elMeta ? elMeta.calculationType === 'volume' : false;
              const inputVal = inputs[idx] || {};
              const defaultL = elMeta?.defaultLength || 2.0;
              const displayWidth = inputVal.width !== undefined && inputVal.width !== '' ? Math.round(Number(inputVal.width) * 100) : (elMeta?.width ? Math.round(elMeta.width * 100) : 0);
              const displayHeight = inputVal.height !== undefined && inputVal.height !== '' ? Math.round(Number(inputVal.height) * 100) : (elMeta?.height ? Math.round(elMeta.height * 100) : 0);

              return (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #000', padding: 8 }}>{item.name}</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{isVol ? `${defaultL} m` : '—'}</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{isVol ? `${displayHeight} sm` : '—'}</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{isVol ? `${displayWidth} sm` : '—'}</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right' }}>{item.unitPrice.toLocaleString()} so&apos;m</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 'bold' }}>{item.totalPrice.toLocaleString()} so&apos;m</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={7} style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 'bold' }}>UMUMIY SUMMA:</td>
              <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
                {result?.total.toLocaleString()} so&apos;m
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 50, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px' }}>Tuzuvchi: _______________________</p>
          </div>
          <div>
            <p style={{ fontSize: '12px' }}>M.O&apos;. imzo: _______________________</p>
          </div>
        </div>
      </div>
    </>
  );
}
