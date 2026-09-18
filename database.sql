-- ==============================================================================
-- 1. BUSINESS PARTNERS (Unified Customers & Suppliers)
-- ==============================================================================

CREATE TABLE BusinessPartners (
    PartnerID INT IDENTITY(1,1) PRIMARY KEY,
    CompanyName NVARCHAR(255) NOT NULL,
    PartnerType NVARCHAR(50) NOT NULL 
        CHECK (PartnerType IN ('Supplier', 'Customer', 'Both')),
    NTN NVARCHAR(50), -- National Tax Number, Nullable
    Email NVARCHAR(150),
    Phone NVARCHAR(50),
    BillingAddress NVARCHAR(MAX),
    ShippingAddress NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- ==============================================================================
-- 2. INVENTORY & CATALOG (Unified Item Master)
-- ==============================================================================
CREATE TABLE InventoryItems (
    ItemID INT IDENTITY(1,1) PRIMARY KEY,
    SKU NVARCHAR(50) NOT NULL UNIQUE,
    ItemName NVARCHAR(255) NOT NULL,
    ItemNameUrdu NVARCHAR(255), -- Added to support Urdu translation
    ItemType NVARCHAR(50) NOT NULL 
        CHECK (ItemType IN ('Raw Material', 'Finished Good', 'Consumable')),
    HSCode NVARCHAR(50), 
    StockQuantity DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    UnitOfMeasure NVARCHAR(20) NOT NULL,
    CostPerUnit DECIMAL(10, 4) NOT NULL DEFAULT 0.00,
    IsActive BIT DEFAULT 1,
    LastUpdated DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- ==============================================================================
-- 3. MANUFACTURING & PRODUCTION 
-- ==============================================================================

CREATE TABLE Formulas (
    FormulaID INT IDENTITY(1,1) PRIMARY KEY,
    TargetItemID INT NOT NULL FOREIGN KEY REFERENCES InventoryItems(ItemID),
    Version INT NOT NULL DEFAULT 1,
    TheoreticalYield DECIMAL(10, 2) NOT NULL, -- Defines what the batch SHOULD produce
    IsActive BIT NOT NULL DEFAULT 1,
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

CREATE TABLE FormulaIngredients (
    FormulaID INT NOT NULL FOREIGN KEY REFERENCES Formulas(FormulaID),
    IngredientItemID INT NOT NULL FOREIGN KEY REFERENCES InventoryItems(ItemID),
    QuantityRequired DECIMAL(10, 2) NOT NULL,
    SequenceOrder INT NOT NULL,
    PRIMARY KEY (FormulaID, IngredientItemID)
);

CREATE TABLE ProductionBatches (
    BatchID INT IDENTITY(1,1) PRIMARY KEY,
    FormulaID INT NOT NULL FOREIGN KEY REFERENCES Formulas(FormulaID),
    Status NVARCHAR(50) DEFAULT 'Pending' 
        CHECK (Status IN ('Pending', 'In Progress', 'Completed')), 
    VolumeProduced DECIMAL(10, 2), -- The ACTUAL yield added to inventory upon completion
    BatchDate DATE DEFAULT CAST(SYSUTCDATETIME() AS DATE)
);

-- ==============================================================================
-- 4. PROCUREMENT & PAYABLES
-- ==============================================================================

CREATE TABLE PurchaseOrders (
    POID INT IDENTITY(1,1) PRIMARY KEY,
    PartnerID INT NOT NULL FOREIGN KEY REFERENCES BusinessPartners(PartnerID),
    OrderDate DATETIME2 DEFAULT SYSUTCDATETIME(),
    TotalAmount DECIMAL(18, 2) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Draft'
);

CREATE TABLE PurchaseOrderLines (
    POLineID INT IDENTITY(1,1) PRIMARY KEY,
    POID INT NOT NULL FOREIGN KEY REFERENCES PurchaseOrders(POID),
    ItemID INT NOT NULL FOREIGN KEY REFERENCES InventoryItems(ItemID),
    QuantityOrdered DECIMAL(10, 2) NOT NULL,
    QuantityReceived DECIMAL(10, 2) DEFAULT 0.00,
    UnitPrice DECIMAL(18, 4) NOT NULL
);

CREATE TABLE DebitVouchers (
    VoucherID INT IDENTITY(1,1) PRIMARY KEY,
    POID INT NULL FOREIGN KEY REFERENCES PurchaseOrders(POID), -- Nullable for generic services
    PartnerID INT NULL FOREIGN KEY REFERENCES BusinessPartners(PartnerID), -- Nullable for petty cash/unregistered
    PayeeName NVARCHAR(255) NULL, -- Name field when PartnerID is not used
    PaidFromAccount NVARCHAR(255) NOT NULL, -- Text field for Cash or Bank Account Name/Number
    VoucherDate DATETIME2 DEFAULT SYSUTCDATETIME(),
    Amount DECIMAL(18, 2) NOT NULL,
    ChequeNo NVARCHAR(100) NULL,
    Description NVARCHAR(MAX) NOT NULL
);

-- ==============================================================================
-- 5. SALES & FULFILLMENT
-- ==============================================================================

CREATE TABLE SalesOrders (
    SOID INT IDENTITY(1,1) PRIMARY KEY,
    PartnerID INT NOT NULL FOREIGN KEY REFERENCES BusinessPartners(PartnerID),
    OrderDate DATETIME2 DEFAULT SYSUTCDATETIME(),
    TotalAmount DECIMAL(18, 2) NOT NULL,
    OrderStatus NVARCHAR(50) DEFAULT 'Received' 
        CHECK (OrderStatus IN ('Received', 'Manufactured', 'Partial Delivery', 'Dispatched', 'Partial Payment', 'Paid'))
);

CREATE TABLE SalesOrderLines (
    SOLineID INT IDENTITY(1,1) PRIMARY KEY,
    SOID INT NOT NULL FOREIGN KEY REFERENCES SalesOrders(SOID),
    ItemID INT NOT NULL FOREIGN KEY REFERENCES InventoryItems(ItemID),
    QuantityOrdered DECIMAL(10, 2) NOT NULL,
    QuantityDispatched DECIMAL(10, 2) DEFAULT 0.00,
    UnitPrice DECIMAL(18, 4) NOT NULL
);

CREATE TABLE DeliveryChallans (
    ChallanID INT IDENTITY(1,1) PRIMARY KEY,
    SOID INT NOT NULL FOREIGN KEY REFERENCES SalesOrders(SOID),
    DispatchDate DATETIME2 DEFAULT SYSUTCDATETIME(),
    VehicleNumber NVARCHAR(50),
    DriverContact NVARCHAR(50),
    DeliveryStatus NVARCHAR(50) DEFAULT 'Dispatched'
);

CREATE TABLE DeliveryChallanLines (
    ChallanLineID INT IDENTITY(1,1) PRIMARY KEY,
    ChallanID INT NOT NULL FOREIGN KEY REFERENCES DeliveryChallans(ChallanID),
    SOLineID INT NOT NULL FOREIGN KEY REFERENCES SalesOrderLines(SOLineID),
    QuantityDelivered DECIMAL(10, 2) NOT NULL
);

-- ==============================================================================
-- 6. BILLING & ACCOUNTING
-- ==============================================================================

CREATE TABLE Invoices (
    InvoiceID INT IDENTITY(1,1) PRIMARY KEY,
    SOID INT NOT NULL FOREIGN KEY REFERENCES SalesOrders(SOID),
    InvoiceDate DATETIME2 DEFAULT SYSUTCDATETIME(),
    SubTotal DECIMAL(18, 2) NOT NULL,
    TaxAmount DECIMAL(18, 2) NOT NULL,
    TotalAmount DECIMAL(18, 2) NOT NULL,
    AmountDue DECIMAL(18, 2) NOT NULL,
    PaymentStatus NVARCHAR(50) DEFAULT 'Unpaid' 
        CHECK (PaymentStatus IN ('Unpaid', 'Partial Payment', 'Paid'))
);

-- Handles incoming payments from customers
CREATE TABLE IncomingPayments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceID INT NOT NULL FOREIGN KEY REFERENCES Invoices(InvoiceID),
    PaymentDate DATETIME2 DEFAULT SYSUTCDATETIME(),
    AmountPaid DECIMAL(18, 2) NOT NULL,
    PaymentMethod NVARCHAR(50), 
    ChequeNo NVARCHAR(100) NULL,
    Notes NVARCHAR(MAX)
);

CREATE TABLE LedgerEntries (
    EntryID INT IDENTITY(1,1) PRIMARY KEY,
    AccountType NVARCHAR(50) NOT NULL, 
    TransactionType NVARCHAR(10) NOT NULL, -- 'Dr' or 'Cr'
    Amount DECIMAL(18, 2) NOT NULL,
    SourceDocumentType NVARCHAR(50) NOT NULL, 
    SourceDocumentID INT NOT NULL, 
    EntryDate DATETIME2 DEFAULT SYSUTCDATETIME(),
    Description NVARCHAR(MAX)
);
GO

-- ==============================================================================
-- 7. AZURE SQL AUTHENTICATION & SECURITY
-- ==============================================================================

CREATE USER [NodeBackendUser] WITH PASSWORD = 'StrongSecurePassword123!';
GO

CREATE ROLE [FormulaAppRole];
GO

GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO [FormulaAppRole];
GO

ALTER ROLE [FormulaAppRole] ADD MEMBER [NodeBackendUser];
GO