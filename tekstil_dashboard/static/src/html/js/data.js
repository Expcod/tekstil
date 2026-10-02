/**
 * Tekstil & Ro'mol ERP - 100% Real Odoo Bazasidagi Mahsulotlar va Ma'lumotlar
 */

const DEFAULT_DATA = {
  rawMaterials: [
    {
      id: 1,
      name: "Suprim Paxta Mato 100% (Oq, 180 gr/m2)",
      category: "fabric",
      unit: "kg",
      stock: 420,
      minStock: 100,
      price: 45000,
      color: "Oq",
      yieldPerMeter: null,
      updatedAt: "2026-10-02 21:15"
    },
    {
      id: 2,
      name: "Ko'ylaklik Paxta Poplin Mato (Oq)",
      category: "fabric",
      unit: "metr",
      stock: 180,
      minStock: 50,
      price: 22000,
      color: "Oq",
      yieldPerMeter: 3,
      updatedAt: "2026-10-02 21:15"
    },
    {
      id: 3,
      name: "Shtapel Viskoza Mato (Gulli bosma)",
      category: "fabric",
      unit: "metr",
      stock: 250,
      minStock: 60,
      price: 26000,
      color: "Gulli / Rang-barang",
      yieldPerMeter: 3,
      updatedAt: "2026-10-02 21:15"
    },
    {
      id: 4,
      name: "Tvil Shimlik Paxta Mato (To'q ko'k)",
      category: "fabric",
      unit: "metr",
      stock: 310,
      minStock: 80,
      price: 33000,
      color: "To'q ko'k (Navy)",
      yieldPerMeter: 2,
      updatedAt: "2026-10-02 21:15"
    },
    {
      id: 5,
      name: "Polyester Tikuv Ipi 40/2 (Bobina)",
      category: "accessory",
      unit: "bobina",
      stock: 24,
      minStock: 10,
      price: 9500,
      color: "Oq / Ko'k / Qora",
      yieldPerMeter: null,
      updatedAt: "2026-10-02 21:15"
    },
    {
      id: 6,
      name: "Ko'ylak Tugmasi (Oq marvarid 11mm)",
      category: "accessory",
      unit: "dona",
      stock: 4800,
      minStock: 1000,
      price: 120,
      color: "Oq marvarid",
      yieldPerMeter: null,
      updatedAt: "2026-10-02 21:15"
    },
    {
      id: 7,
      name: "Shim Metall Molniyasi (18 sm)",
      category: "accessory",
      unit: "dona",
      stock: 850,
      minStock: 200,
      price: 2200,
      color: "To'q ko'k metall",
      yieldPerMeter: null,
      updatedAt: "2026-10-02 21:15"
    },
    {
      id: 8,
      name: "Dublerin / Flizelin Yoqa uchun (Oq)",
      category: "fabric",
      unit: "metr",
      stock: 160,
      minStock: 40,
      price: 12000,
      color: "Oq",
      yieldPerMeter: null,
      updatedAt: "2026-10-02 21:15"
    },
    {
      id: 9,
      name: "To'qima Brend Yorlig'i (Main Label)",
      category: "packaging",
      unit: "dona",
      stock: 1850,
      minStock: 500,
      price: 450,
      color: "Brend logotip",
      yieldPerMeter: null,
      updatedAt: "2026-10-02 21:15"
    },
    {
      id: 10,
      name: "Polietilen Kiyim Paketi (Salafan)",
      category: "packaging",
      unit: "dona",
      stock: 1920,
      minStock: 500,
      price: 300,
      color: "Shaffof brendli",
      yieldPerMeter: null,
      updatedAt: "2026-10-02 21:15"
    }
  ],
  boms: [
    {
      id: "BOM-01",
      name: "Terra Pro Erkaklar Futbolkasi (Oq)",
      size: "M, L, XL",
      fabricId: 1,
      yieldPerMeter: 4,
      stoneId: null,
      stonesPerPiece: 0,
      threadCost: 350,
      labelCost: 450,
      packageCost: 300,
      laborCost: 6500,
      overheadCost: 2000,
      sellingPrice: 65000,
      costPrice: 32000,
      retailPrice: 85000,
      notes: "100% paxta suprim mato, 180 gr/m2, Terra Pro buyurtmasi"
    },
    {
      id: "BOM-02",
      name: "Klassik Erkaklar Oq Ko'ylagi (Slim Fit)",
      size: "39, 40, 41, 42",
      fabricId: 2,
      yieldPerMeter: 2,
      stoneId: null,
      stonesPerPiece: 8,
      threadCost: 600,
      labelCost: 450,
      packageCost: 300,
      laborCost: 18000,
      overheadCost: 4500,
      sellingPrice: 180000,
      costPrice: 85000,
      retailPrice: 220000,
      notes: "Paxta poplin, marvarid tugmalar, qattiq yoqa dublerinli"
    },
    {
      id: "BOM-03",
      name: "Ayollar Yozgi Ko'ylagi (Gulli Viskoza)",
      size: "S, M, L",
      fabricId: 3,
      yieldPerMeter: 1.5,
      stoneId: null,
      stonesPerPiece: 0,
      threadCost: 500,
      labelCost: 450,
      packageCost: 300,
      laborCost: 22000,
      overheadCost: 5000,
      sellingPrice: 220000,
      costPrice: 95000,
      retailPrice: 280000,
      notes: "Shtapel viskoza gulli mato, yengil yozgi bichim"
    },
    {
      id: "BOM-04",
      name: "Erkaklar Chinos Shimi (To'q ko'k)",
      size: "30, 32, 34, 36",
      fabricId: 4,
      yieldPerMeter: 1.8,
      stoneId: null,
      stonesPerPiece: 1,
      threadCost: 800,
      labelCost: 450,
      packageCost: 300,
      laborCost: 24000,
      overheadCost: 6000,
      sellingPrice: 195000,
      costPrice: 88000,
      retailPrice: 250000,
      notes: "Tvil paxta mato, metall molniya, mustahkam chok"
    }
  ],
  batches: [
    {
      id: "WH/MO/00001",
      bomId: "BOM-01",
      name: "Terra Pro Futbolka Partiyasi",
      size: "M-XL",
      rollNumber: "SUPRIM-01",
      fabricMetersCut: 125,
      yieldPerMeter: 4,
      quantity: 500,
      currentStage: "packing",
      fabricId: 1,
      stoneId: null,
      startDate: "2026-10-02",
      operator: "Dilnoza Rahimova",
      notes: "OTK nazoratidan 98.8% sifat bilan o'tdi va qadoqlandi"
    },
    {
      id: "WH/MO/00002",
      bomId: "BOM-02",
      name: "Klassik Oq Ko'ylak Partiyasi",
      size: "39-42",
      rollNumber: "POPLIN-01",
      fabricMetersCut: 100,
      yieldPerMeter: 2,
      quantity: 250,
      currentStage: "sewing",
      fabricId: 2,
      stoneId: null,
      startDate: "2026-10-03",
      operator: "Shahnoza Yusupova",
      notes: "Tikuv liniyasida yoqa va yenglar tikilmoqda"
    },
    {
      id: "WH/MO/00003",
      bomId: "BOM-03",
      name: "Ayollar Yozgi Ko'ylagi",
      size: "S-L",
      rollNumber: "VISKOZA-01",
      fabricMetersCut: 120,
      yieldPerMeter: 1.5,
      quantity: 200,
      currentStage: "cutting",
      fabricId: 3,
      stoneId: null,
      startDate: "2026-10-03",
      operator: "Anvar Bichuvchi",
      notes: "Bichuv stolida lekalalar bo'yicha kesilmoqda"
    }
  ],
  finishedGoods: [
    {
      id: 11,
      name: "Terra Pro Erkaklar Futbolkasi (Oq, 100% Paxta)",
      sku: "TERRA-TSHIRT-WHT",
      size: "M, L, XL",
      color: "Oq",
      decorType: "To'qima leyblli",
      stock: 380,
      price: 65000,
      costPrice: 32000,
      lastProduced: "2026-10-02"
    },
    {
      id: 12,
      name: "Klassik Erkaklar Oq Ko'ylagi (Slim Fit)",
      sku: "CLASSIC-SHIRT-WHT",
      size: "39-42",
      color: "Oq",
      decorType: "Marvarid tugmali",
      stock: 220,
      price: 180000,
      costPrice: 85000,
      lastProduced: "2026-10-02"
    },
    {
      id: 13,
      name: "Ayollar Yozgi Ko'ylagi (Gulli Viskoza)",
      sku: "WOMEN-DRESS-FLOR",
      size: "S, M, L",
      color: "Gulli / Multi",
      decorType: "Bog'ichli bel",
      stock: 160,
      price: 220000,
      costPrice: 95000,
      lastProduced: "2026-10-01"
    },
    {
      id: 14,
      name: "Erkaklar Chinos Shimi (To'q ko'k)",
      sku: "CHINOS-PANTS-NVY",
      size: "30-36",
      color: "To'q ko'k",
      decorType: "Metall furnitura",
      stock: 140,
      price: 195000,
      costPrice: 88000,
      lastProduced: "2026-10-01"
    },
    {
      id: 15,
      name: "Novatex Premium Polo Futbolka (Pikye)",
      sku: "POLO-PREMIUM-BLU",
      size: "M, L, XL",
      color: "Moviy",
      decorType: "Yoqali & Tugmali",
      stock: 110,
      price: 110000,
      costPrice: 48000,
      lastProduced: "2026-09-30"
    }
  ],
  financials: {
    monthlySalesVolume: 1010,
    monthlyRevenue: 108860000,
    totalRawMaterialsCost: 49600000,
    totalLaborCost: 6250000,
    totalOverheadCost: 3800000,
    netProfit: 49210000,
    profitMargin: 45.2,
    bankBalance: 26880000,
    cashBalance: 8450000
  },
  historyLogs: [
    {
      id: "LOG-2001",
      timestamp: "2026-10-03 09:30",
      action: "sale_out",
      description: "Chiqim: 120 dona \"Terra Pro Futbolkasi\" (Terra Pro MChJ) ga yetkazildi. Jami: 26,880,000 so'm (QQS bilan).",
      user: "Alisher R. (Seh boshlig'i)"
    },
    {
      id: "LOG-2002",
      timestamp: "2026-10-03 08:45",
      action: "payment_in",
      description: "To'lov tushumi: Terra Pro MChJ dan BNK1 hisobiga 26,880,000 so'm qabul qilindi.",
      user: "Buxgalteriya"
    },
    {
      id: "LOG-2003",
      timestamp: "2026-10-02 23:06",
      action: "batch_complete",
      description: "WH/MO/00001 (500 dona Terra Pro Futbolkasi) ishlab chiqarildi va tayyor omborga qabul qilindi!",
      user: "Sex boshlig'i"
    },
    {
      id: "LOG-2004",
      timestamp: "2026-10-02 22:50",
      action: "qc_pass",
      description: "OTK-2026-0005: 500 dona tekshirildi, 494 ta 1-nav (98.8% sifat darajasi bilan qabul qilindi).",
      user: "Sifat Nazoratchi (OTK)"
    },
    {
      id: "LOG-2005",
      timestamp: "2026-10-02 21:15",
      action: "raw_in",
      description: "Xomashyo kirimi: +420 kg Suprim Paxta mato va +24 bobina tikuv iplari qabul qilindi (WH/IN/00001).",
      user: "Omborchi"
    }
  ],
  clients: [
    {
      id: 6,
      name: "Terra Pro MChJ",
      contactPerson: "Rustam aka (Xarid bo'limi)",
      phone: "+998 71 200-11-22",
      address: "Toshkent sh., Yunusobod t., Amir Temur shox ko'chasi 45",
      balance: 0,
      totalPurchased: 53760000,
      totalPaid: 53760000,
      lastActivity: "2026-10-03 09:30",
      transactions: [
        {
          id: "tx-601",
          date: "2026-09-28 10:00",
          type: "sale",
          title: "Terra Pro Erkaklar Futbolkasi (Shartnoma S00001)",
          amount: 26880000,
          paid: 26880000,
          debtChange: 0,
          balanceAfter: 0,
          paymentMethod: "Bank o'tkazmasi (BNK1)",
          notes: "1-partiya uchun to'liq to'lov"
        },
        {
          id: "tx-602",
          date: "2026-10-03 08:45",
          type: "sale",
          title: "Terra Pro Erkaklar Futbolkasi 2-partiya (INV/2026/00002)",
          amount: 26880000,
          paid: 26880000,
          debtChange: 0,
          balanceAfter: 0,
          paymentMethod: "Bank o'tkazmasi (BNK1)",
          notes: "2-partiya to'liq yopildi"
        }
      ]
    },
    {
      id: 9,
      name: "Novatex Fashion Export",
      contactPerson: "Sardor Karimov",
      phone: "+998 97 777-88-99",
      address: "Toshkent sh., Chilonzor t., Katta Chilonzor 18",
      balance: 9811200,
      totalPurchased: 24500000,
      totalPaid: 14688800,
      lastActivity: "2026-10-02 20:30",
      transactions: [
        {
          id: "tx-901",
          date: "2026-09-30 14:00",
          type: "sale",
          title: "Novatex Polo Futbolkalar va Xomashyo xaridi",
          amount: 24500000,
          paid: 14688800,
          debtChange: 9811200,
          balanceAfter: 9811200,
          paymentMethod: "Bank o'tkazmasi",
          notes: "Nasiya qoldig'i 10 kun ichida to'lanadi"
        }
      ]
    },
    {
      id: 7,
      name: "Just Brands O'zbekiston",
      contactPerson: "Davron aka",
      phone: "+998 71 200-33-44",
      address: "Toshkent sh., Mirobod t., Nukus ko'chasi 21",
      balance: 0,
      totalPurchased: 18200000,
      totalPaid: 18200000,
      lastActivity: "2026-09-29 16:30",
      transactions: [
        {
          id: "tx-701",
          date: "2026-09-29 16:30",
          type: "sale",
          title: "Klassik Oq Ko'ylaklar (100 dona)",
          amount: 18200000,
          paid: 18200000,
          debtChange: 0,
          balanceAfter: 0,
          paymentMethod: "Bank o'tkazmasi",
          notes: "To'liq to'langan"
        }
      ]
    },
    {
      id: 8,
      name: "D&M Collection",
      contactPerson: "Dildora opa",
      phone: "+998 90 123-45-67",
      address: "Samarqand sh., Registon savdo majmuasi 14-do'kon",
      balance: 0,
      totalPurchased: 12400000,
      totalPaid: 12400000,
      lastActivity: "2026-09-27 12:00",
      transactions: [
        {
          id: "tx-801",
          date: "2026-09-27 12:00",
          type: "sale",
          title: "Ayollar Yozgi Ko'ylagi (Gulli Viskoza)",
          amount: 12400000,
          paid: 12400000,
          debtChange: 0,
          balanceAfter: 0,
          paymentMethod: "Bank o'tkazmasi",
          notes: "To'liq to'langan"
        }
      ]
    }
  ]
};
