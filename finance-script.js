// ===== Data Store =====
class FinanceManager {
    constructor() {
        this.operations = this.loadData('operations') || [];
        this.payments = this.loadData('payments') || [];
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.updatePaymentOperationSelect();
        this.renderAll();
        this.setDefaultDate();
    }

    // ===== Local Storage =====
    loadData(key) {
        try {
            const data = localStorage.getItem(`fertility-finance-${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading data:', e);
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(`fertility-finance-${key}`, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving data:', e);
            alert('Error al guardar los datos. Tu navegador puede tener el almacenamiento lleno.');
        }
    }

    // ===== Theme Management =====
    setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('fertility-finance-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('fertility-finance-theme', newTheme);
        });
    }

    // ===== Event Listeners =====
    setupEventListeners() {
        // Operation form
        document.getElementById('add-operation-btn').addEventListener('click', () => {
            document.getElementById('operation-form').classList.remove('hidden');
        });

        document.getElementById('cancel-operation').addEventListener('click', () => {
            document.getElementById('operation-form').classList.add('hidden');
            document.getElementById('new-operation-form').reset();
        });

        document.getElementById('new-operation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addOperation();
        });

        // Auto-calculate operation total
        const medsInput = document.getElementById('op-meds');
        const procedureInput = document.getElementById('op-procedure');
        const totalInput = document.getElementById('op-total');

        const calculateTotal = () => {
            const meds = parseFloat(medsInput.value) || 0;
            const procedure = parseFloat(procedureInput.value) || 0;
            totalInput.value = (meds + procedure).toFixed(2);
        };

        medsInput.addEventListener('input', calculateTotal);
        procedureInput.addEventListener('input', calculateTotal);

        // Payment form
        document.getElementById('payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPayment();
        });

        // History filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderPayments(e.target.dataset.filter);
            });
        });

        // Data management
        document.getElementById('export-data').addEventListener('click', () => this.exportData());
        document.getElementById('import-data').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file').addEventListener('change', (e) => this.importData(e));
        document.getElementById('clear-all-data').addEventListener('click', () => this.clearAllData());
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('payment-date').value = today;
    }

    // ===== Operations Management =====
    addOperation() {
        const name = document.getElementById('op-name').value.trim();
        const meds = parseFloat(document.getElementById('op-meds').value) || 0;
        const procedure = parseFloat(document.getElementById('op-procedure').value) || 0;
        const total = meds + procedure;

        if (!name || total <= 0) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }

        const operation = {
            id: Date.now(),
            name,
            medicationCost: meds,
            procedureCost: procedure,
            totalCost: total,
            createdAt: new Date().toISOString()
        };

        this.operations.push(operation);
        this.saveData('operations', this.operations);

        // Reset form
        document.getElementById('new-operation-form').reset();
        document.getElementById('operation-form').classList.add('hidden');

        this.updatePaymentOperationSelect();
        this.renderAll();
    }

    deleteOperation(id) {
        if (!confirm('¿Estás seguro de eliminar esta operación? Los pagos asociados también se eliminarán.')) {
            return;
        }

        this.operations = this.operations.filter(op => op.id !== id);
        this.payments = this.payments.filter(p => p.operationId !== id);

        this.saveData('operations', this.operations);
        this.saveData('payments', this.payments);

        this.updatePaymentOperationSelect();
        this.renderAll();
    }

    updatePaymentOperationSelect() {
        const select = document.getElementById('payment-operation');
        const currentValue = select.value;

        select.innerHTML = '<option value="">Selecciona una operación</option>';

        this.operations.forEach(op => {
            const option = document.createElement('option');
            option.value = op.id;
            option.textContent = op.name;
            select.appendChild(option);
        });

        // Restore selection if still valid
        if (currentValue && this.operations.some(op => op.id === parseInt(currentValue))) {
            select.value = currentValue;
        }
    }

    // ===== Payments Management =====
    addPayment() {
        const date = document.getElementById('payment-date').value;
        const amount = parseFloat(document.getElementById('payment-amount').value);
        const payer = document.querySelector('input[name="payer"]:checked')?.value;
        const operationId = parseInt(document.getElementById('payment-operation').value);
        const notes = document.getElementById('payment-notes').value.trim();

        if (!date || !amount || !payer || !operationId) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }

        const operation = this.operations.find(op => op.id === operationId);
        if (!operation) {
            alert('Operación no encontrada.');
            return;
        }

        const payment = {
            id: Date.now(),
            date,
            amount,
            payer,
            operationId,
            operationName: operation.name,
            notes,
            createdAt: new Date().toISOString()
        };

        this.payments.push(payment);
        this.saveData('payments', this.payments);

        // Reset form
        document.getElementById('payment-form').reset();
        this.setDefaultDate();

        this.renderAll();
    }

    deletePayment(id) {
        if (!confirm('¿Estás seguro de eliminar este pago?')) {
            return;
        }

        this.payments = this.payments.filter(p => p.id !== id);
        this.saveData('payments', this.payments);
        this.renderAll();
    }

    // ===== Calculations =====
    getTotalTreatmentCost() {
        return this.operations.reduce((sum, op) => sum + op.totalCost, 0);
    }

    getTotalPaid() {
        return this.payments.reduce((sum, p) => sum + p.amount, 0);
    }

    getTotalPending() {
        return this.getTotalTreatmentCost() - this.getTotalPaid();
    }

    getContributionByPerson(person) {
        return this.payments
            .filter(p => p.payer === person)
            .reduce((sum, p) => sum + p.amount, 0);
    }

    getPaidForOperation(operationId) {
        return this.payments
            .filter(p => p.operationId === operationId)
            .reduce((sum, p) => sum + p.amount, 0);
    }

    getProgressPercentage(operationId) {
        const operation = this.operations.find(op => op.id === operationId);
        if (!operation) return 0;

        const paid = this.getPaidForOperation(operationId);
        return Math.min((paid / operation.totalCost) * 100, 100);
    }

    // ===== Rendering =====
    renderAll() {
        this.renderSummary();
        this.renderContributions();
        this.renderOperations();
        this.renderPayments('all');
    }

    renderSummary() {
        const total = this.getTotalTreatmentCost();
        const paid = this.getTotalPaid();
        const pending = this.getTotalPending();

        document.getElementById('total-treatment').textContent = this.formatCurrency(total);
        document.getElementById('total-paid').textContent = this.formatCurrency(paid);
        document.getElementById('total-pending').textContent = this.formatCurrency(pending);
    }

    renderContributions() {
        const sanContribution = this.getContributionByPerson('San');
        const pineContribution = this.getContributionByPerson('Pine');
        const total = sanContribution + pineContribution;

        document.getElementById('san-contribution').textContent = this.formatCurrency(sanContribution);
        document.getElementById('pine-contribution').textContent = this.formatCurrency(pineContribution);

        // Update progress bars
        const sanPercentage = total > 0 ? (sanContribution / total) * 100 : 0;
        const pinePercentage = total > 0 ? (pineContribution / total) * 100 : 0;

        document.getElementById('san-progress').style.width = `${sanPercentage}%`;
        document.getElementById('pine-progress').style.width = `${pinePercentage}%`;
    }

    renderOperations() {
        const container = document.getElementById('operations-list');

        if (this.operations.length === 0) {
            container.innerHTML = '<p class="empty-message">No hay operaciones registradas. Haz clic en "+ Agregar Operación" para comenzar.</p>';
            return;
        }

        container.innerHTML = this.operations.map(op => {
            const paid = this.getPaidForOperation(op.id);
            const pending = op.totalCost - paid;
            const progress = this.getProgressPercentage(op.id);

            return `
                <div class="operation-card">
                    <div class="operation-header">
                        <h3 class="operation-title">${this.escapeHtml(op.name)}</h3>
                        <button class="operation-delete" onclick="financeManager.deleteOperation(${op.id})">
                            🗑️ Eliminar
                        </button>
                    </div>

                    <div class="operation-costs">
                        <div class="cost-item">
                            <div class="cost-label">Medicamentos</div>
                            <div class="cost-value">${this.formatCurrency(op.medicationCost)}</div>
                        </div>
                        <div class="cost-item">
                            <div class="cost-label">Operación</div>
                            <div class="cost-value">${this.formatCurrency(op.procedureCost)}</div>
                        </div>
                        <div class="cost-item">
                            <div class="cost-label">Total</div>
                            <div class="cost-value">${this.formatCurrency(op.totalCost)}</div>
                        </div>
                    </div>

                    <div class="operation-progress">
                        <div class="progress-info">
                            <span>Pagado: ${this.formatCurrency(paid)} / ${this.formatCurrency(op.totalCost)}</span>
                            <span class="progress-percentage">${progress.toFixed(1)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-info" style="margin-top: 0.5rem;">
                            <span style="color: var(--accent-orange)">Pendiente: ${this.formatCurrency(pending)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPayments(filter = 'all') {
        const container = document.getElementById('payments-list');

        let filteredPayments = this.payments;
        if (filter !== 'all') {
            filteredPayments = this.payments.filter(p => p.payer === filter);
        }

        // Sort by date (most recent first)
        filteredPayments.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filteredPayments.length === 0) {
            container.innerHTML = '<p class="empty-message">No hay pagos registrados.</p>';
            return;
        }

        container.innerHTML = filteredPayments.map(payment => `
            <div class="payment-item" data-payer="${payment.payer}">
                <div class="payment-icon">${payment.payer === 'San' ? '👨' : '👩'}</div>
                <div class="payment-info">
                    <h4>${this.escapeHtml(payment.operationName)}</h4>
                    <div class="payment-meta">
                        ${payment.payer} • ${this.formatDate(payment.date)}
                        ${payment.notes ? ` • ${this.escapeHtml(payment.notes)}` : ''}
                    </div>
                </div>
                <div class="payment-amount">${this.formatCurrency(payment.amount)}</div>
                <button class="payment-delete" onclick="financeManager.deletePayment(${payment.id})">
                    🗑️
                </button>
            </div>
        `).join('');
    }

    // ===== Data Import/Export =====
    exportData() {
        const data = {
            operations: this.operations,
            payments: this.payments,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tratamiento-fertilidad-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        alert('✅ Datos exportados correctamente');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (!data.operations || !data.payments) {
                    alert('❌ Archivo inválido. Asegúrate de importar un archivo exportado previamente.');
                    return;
                }

                if (!confirm('⚠️ Esto reemplazará todos los datos actuales. ¿Continuar?')) {
                    return;
                }

                this.operations = data.operations;
                this.payments = data.payments;

                this.saveData('operations', this.operations);
                this.saveData('payments', this.payments);

                this.updatePaymentOperationSelect();
                this.renderAll();

                alert('✅ Datos importados correctamente');
            } catch (error) {
                alert('❌ Error al importar datos: ' + error.message);
            }
        };

        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }

    clearAllData() {
        if (!confirm('⚠️ ¿Estás seguro de borrar TODOS los datos? Esta acción no se puede deshacer.')) {
            return;
        }

        if (!confirm('⚠️ ÚLTIMA CONFIRMACIÓN: Se borrarán todas las operaciones y pagos. ¿Continuar?')) {
            return;
        }

        this.operations = [];
        this.payments = [];

        this.saveData('operations', this.operations);
        this.saveData('payments', this.payments);

        this.updatePaymentOperationSelect();
        this.renderAll();

        alert('✅ Todos los datos han sido borrados');
    }

    // ===== Utility Functions =====
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return new Intl.DateTimeFormat('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ===== Initialize App =====
const financeManager = new FinanceManager();

console.log('💕 Gestor de Tratamiento de Fertilidad cargado correctamente');
console.log('📊 Operaciones:', financeManager.operations.length);
console.log('💳 Pagos:', financeManager.payments.length);
