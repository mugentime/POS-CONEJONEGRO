/**
 * CustomerSearch - Componente de búsqueda de clientes con autocompletado
 * Sistema POS Conejo Negro
 */

class CustomerSearch {
    constructor(inputElement, options = {}) {
        this.input = inputElement;
        this.options = {
            placeholder: 'Buscar cliente por nombre, teléfono o email...',
            minLength: 1,
            maxResults: 10,
            showDetails: true,
            onSelect: null,
            onCreate: null,
            apiEndpoint: '/api/customers/search/',
            ...options
        };
        
        this.customers = [];
        this.searchTimeout = null;
        this.selectedCustomer = null;
        this.isVisible = false;
        
        this.init();
    }

    init() {
        this.setupInput();
        this.createDropdown();
        this.bindEvents();
    }

    setupInput() {
        this.input.placeholder = this.options.placeholder;
        this.input.classList.add('customer-search-input');
        this.input.autocomplete = 'off';
    }

    createDropdown() {
        // Crear contenedor del dropdown
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'customer-search-dropdown';
        this.dropdown.style.display = 'none';
        
        // Insertar después del input
        this.input.parentNode.insertBefore(this.dropdown, this.input.nextSibling);
        
        // Aplicar estilos
        this.applyStyles();
    }

    applyStyles() {
        // Estilos para el input
        const inputStyles = `
            .customer-search-input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid rgba(0, 217, 255, 0.3);
                border-radius: 8px;
                background: #0a0a0f;
                color: #e0e0ff;
                font-size: 16px;
                transition: all 0.3s ease;
            }
            
            .customer-search-input:focus {
                border-color: #00d9ff;
                outline: none;
                box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
            }
            
            .customer-search-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #1a1a2e;
                border: 2px solid #00d9ff;
                border-top: none;
                border-radius: 0 0 10px 10px;
                max-height: 300px;
                overflow-y: auto;
                z-index: 1000;
                box-shadow: 0 8px 25px rgba(0, 217, 255, 0.3);
            }
            
            .customer-search-item {
                padding: 12px 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                border-bottom: 1px solid rgba(0, 217, 255, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .customer-search-item:hover {
                background: rgba(0, 217, 255, 0.1);
                transform: translateX(3px);
            }
            
            .customer-search-item.active {
                background: rgba(0, 217, 255, 0.2);
                border-left: 4px solid #00d9ff;
            }
            
            .customer-info {
                flex: 1;
            }
            
            .customer-name {
                color: #e0e0ff;
                font-weight: 600;
                margin-bottom: 4px;
                font-size: 16px;
            }
            
            .customer-details {
                color: #a0a0c0;
                font-size: 14px;
                display: flex;
                gap: 15px;
            }
            
            .customer-badge {
                background: linear-gradient(45deg, #ff00d9, #9d00ff);
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .customer-stats {
                text-align: right;
                color: #00d9ff;
                font-size: 12px;
            }
            
            .customer-search-create {
                padding: 12px 16px;
                background: rgba(0, 255, 136, 0.1);
                border-top: 2px solid rgba(0, 255, 136, 0.3);
                cursor: pointer;
                color: #00ff88;
                font-weight: 600;
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .customer-search-create:hover {
                background: rgba(0, 255, 136, 0.2);
            }
            
            .customer-search-loading {
                padding: 20px;
                text-align: center;
                color: #00d9ff;
                font-size: 14px;
            }
            
            .customer-search-empty {
                padding: 20px;
                text-align: center;
                color: #a0a0c0;
                font-size: 14px;
            }
        `;
        
        // Agregar estilos si no existen
        if (!document.getElementById('customer-search-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'customer-search-styles';
            styleSheet.textContent = inputStyles;
            document.head.appendChild(styleSheet);
        }
    }

    bindEvents() {
        // Hacer el contenedor relativo para posicionamiento
        this.input.parentNode.style.position = 'relative';
        
        // Eventos del input
        this.input.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
        
        this.input.addEventListener('focus', () => {
            if (this.input.value.length >= this.options.minLength) {
                this.showDropdown();
            }
        });
        
        this.input.addEventListener('blur', (e) => {
            // Retrasar el ocultamiento para permitir clics en el dropdown
            setTimeout(() => {
                this.hideDropdown();
            }, 200);
        });
        
        this.input.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        // Eventos del documento
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }

    handleInput(value) {
        clearTimeout(this.searchTimeout);
        
        if (value.length < this.options.minLength) {
            this.hideDropdown();
            this.selectedCustomer = null;
            return;
        }
        
        // Debounce la búsqueda
        this.searchTimeout = setTimeout(() => {
            this.searchCustomers(value);
        }, 300);
    }

    async searchCustomers(query) {
        try {
            this.showLoading();
            
            const response = await fetch(`${this.options.apiEndpoint}${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error('Error al buscar clientes');
            }
            
            const customers = await response.json();
            this.customers = customers;
            this.renderResults(customers, query);
            
        } catch (error) {
            console.error('Error searching customers:', error);
            this.showError('Error al buscar clientes');
        }
    }

    renderResults(customers, query) {
        this.dropdown.innerHTML = '';
        
        if (customers.length === 0) {
            this.renderEmpty(query);
        } else {
            customers.forEach((customer, index) => {
                const item = this.createCustomerItem(customer, index);
                this.dropdown.appendChild(item);
            });
        }
        
        // Opción de crear nuevo cliente
        if (this.options.onCreate && query.length > 0) {
            this.renderCreateOption(query);
        }
        
        this.showDropdown();
    }

    createCustomerItem(customer, index) {
        const item = document.createElement('div');
        item.className = 'customer-search-item';
        item.dataset.index = index;
        
        const isVIP = customer.isVIP;
        const vipBadge = isVIP ? '<span class="customer-badge">VIP</span>' : '';
        
        item.innerHTML = `
            <div class="customer-info">
                <div class="customer-name">${customer.name}</div>
                <div class="customer-details">
                    ${customer.phone ? `<span><i class="fas fa-phone"></i> ${customer.phone}</span>` : ''}
                    ${customer.email ? `<span><i class="fas fa-envelope"></i> ${customer.email}</span>` : ''}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                ${vipBadge}
                <div class="customer-stats">
                    <div>${customer.totalVisits} visitas</div>
                    <div>$${customer.totalSpent.toLocaleString()}</div>
                </div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            this.selectCustomer(customer);
        });
        
        return item;
    }

    renderEmpty(query) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'customer-search-empty';
        emptyDiv.innerHTML = `
            <i class="fas fa-search" style="font-size: 24px; margin-bottom: 8px; opacity: 0.5;"></i>
            <div>No se encontraron clientes para "${query}"</div>
        `;
        this.dropdown.appendChild(emptyDiv);
    }

    renderCreateOption(query) {
        const createDiv = document.createElement('div');
        createDiv.className = 'customer-search-create';
        createDiv.innerHTML = `
            <i class="fas fa-plus"></i>
            Crear nuevo cliente: "${query}"
        `;
        
        createDiv.addEventListener('click', () => {
            this.createNewCustomer(query);
        });
        
        this.dropdown.appendChild(createDiv);
    }

    showLoading() {
        this.dropdown.innerHTML = `
            <div class="customer-search-loading">
                <i class="fas fa-spinner fa-spin"></i>
                Buscando clientes...
            </div>
        `;
        this.showDropdown();
    }

    showError(message) {
        this.dropdown.innerHTML = `
            <div class="customer-search-empty" style="color: #ff0055;">
                <i class="fas fa-exclamation-triangle"></i>
                ${message}
            </div>
        `;
        this.showDropdown();
    }

    showDropdown() {
        this.dropdown.style.display = 'block';
        this.isVisible = true;
    }

    hideDropdown() {
        this.dropdown.style.display = 'none';
        this.isVisible = false;
    }

    selectCustomer(customer) {
        this.selectedCustomer = customer;
        this.input.value = customer.name;
        this.hideDropdown();
        
        if (this.options.onSelect) {
            this.options.onSelect(customer);
        }
        
        // Disparar evento personalizado
        this.input.dispatchEvent(new CustomEvent('customerSelected', {
            detail: customer
        }));
    }

    createNewCustomer(query) {
        this.hideDropdown();
        
        if (this.options.onCreate) {
            this.options.onCreate(query);
        }
        
        // Disparar evento personalizado
        this.input.dispatchEvent(new CustomEvent('createCustomer', {
            detail: { name: query }
        }));
    }

    handleKeyDown(e) {
        if (!this.isVisible) return;
        
        const items = this.dropdown.querySelectorAll('.customer-search-item');
        let activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (activeIndex < items.length - 1) {
                    if (activeIndex >= 0) items[activeIndex].classList.remove('active');
                    items[activeIndex + 1].classList.add('active');
                } else if (items.length > 0) {
                    if (activeIndex >= 0) items[activeIndex].classList.remove('active');
                    items[0].classList.add('active');
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (activeIndex > 0) {
                    items[activeIndex].classList.remove('active');
                    items[activeIndex - 1].classList.add('active');
                } else if (items.length > 0) {
                    if (activeIndex >= 0) items[activeIndex].classList.remove('active');
                    items[items.length - 1].classList.add('active');
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && items[activeIndex]) {
                    const customerIndex = parseInt(items[activeIndex].dataset.index);
                    this.selectCustomer(this.customers[customerIndex]);
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                this.hideDropdown();
                this.input.blur();
                break;
        }
    }

    // Métodos públicos
    getSelectedCustomer() {
        return this.selectedCustomer;
    }

    clearSelection() {
        this.selectedCustomer = null;
        this.input.value = '';
        this.hideDropdown();
    }

    setValue(customerName) {
        this.input.value = customerName;
        if (customerName) {
            this.searchCustomers(customerName);
        }
    }

    destroy() {
        clearTimeout(this.searchTimeout);
        if (this.dropdown && this.dropdown.parentNode) {
            this.dropdown.parentNode.removeChild(this.dropdown);
        }
    }
}

// Exportar para uso global
window.CustomerSearch = CustomerSearch;
