/**
 * Sheet View - COMPLETE with WORKING MODALS
 */

export class SheetView {
    constructor(services) {
        this.services = services;
        this.container = null;
        this.viewMode = 'hour';
    }

    render(container) {
        this.container = container;

        container.innerHTML = `
            <div class="sheet-actions">
                <div>
                    <h2 style="margin-bottom: 0.5rem;">Vista Planilla - Disponibilidad</h2>
                    <p style="color: var(--gray-700); font-size: 0.9rem;">Vista completa con calendario por horas</p>
                </div>
                <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <label style="font-size: 0.9rem; font-weight: 600;">Vista:</label>
                        <select id="viewMode" class="filter-select" style="width: 120px;">
                            <option value="day">Por Día</option>
                            <option value="hour" selected>Por Hora</option>
                        </select>
                    </div>
                    <button class="btn btn-secondary">Exportar a Excel</button>
                    <button class="btn btn-primary">Imprimir</button>
                </div>
            </div>

            <div style="padding: 1rem; background: white; border-bottom: 1px solid var(--gray-200); display: flex; gap: 1rem;">
                <input type="text" class="search-input" placeholder="Buscar patente..." style="flex: 1; max-width: 200px;">
            </div>

            <div id="dayView" class="sheet-view" style="display: none;">${this.renderDayView()}</div>
            <div id="hourView" class="sheet-view">${this.renderHourView()}</div>

            <div class="sheet-legend">
                <div class="sheet-legend-item">
                    <div class="sheet-legend-color" style="background: #10b981;"></div>
                    <span>Alquilado</span>
                </div>
                <div class="sheet-legend-item">
                    <div class="sheet-legend-color" style="background: #3b82f6;"></div>
                    <span>Reservado</span>
                </div>
            </div>

            <div id="reservationModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Detalles de la Reserva</h2>
                        <button class="close-btn" id="closeModalBtn">×</button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                            <div><label style="font-weight:600">Vehículo</label><div id="detailVehicle" style="padding:0.75rem;background:var(--gray-50);border-radius:6px;margin-top:0.5rem"></div></div>
                            <div><label style="font-weight:600">Cliente</label><div id="detailClient" style="padding:0.75rem;background:var(--gray-50);border-radius:6px;margin-top:0.5rem"></div></div>
                            <div><label style="font-weight:600">Contrato</label><div id="detailContract" style="padding:0.75rem;background:var(--gray-50);border-radius:6px;margin-top:0.5rem"></div></div>
                            <div><label style="font-weight:600">Fecha Inicio</label><div id="detailStart" style="padding:0.75rem;background:var(--gray-50);border-radius:6px;margin-top:0.5rem"></div></div>
                            <div><label style="font-weight:600">Fecha Fin</label><div id="detailEnd" style="padding:0.75rem;background:var(--gray-50);border-radius:6px;margin-top:0.5rem"></div></div>
                            <div><label style="font-weight:600">Estado</label><div id="detailStatus" style="padding:0.75rem;background:var(--gray-50);border-radius:6px;margin-top:0.5rem"></div></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn" id="closeModalBtn2">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    renderDayView() {
        return `<div class="hour-view-container"><div class="hour-grid">
            <div class="hour-header-vehicles">
                <div class="hour-header-cell">Vehículo</div>
                <div class="hour-category-label">CATEGORÍA C</div>
                ${['C-AH-919-BK', 'C-AH-919-BH', 'C-AH-916-WL'].map(v => `<div class="hour-vehicle-cell"><strong>${v}</strong></div>`).join('')}
                <div class="hour-category-label">CATEGORÍA H</div>
                ${['H-AH-534-CO', 'H-AH-287-WG'].map(v => `<div class="hour-vehicle-cell"><strong>${v}</strong></div>`).join('')}
                <div class="hour-category-label">CATEGORÍA K</div>
                <div class="hour-vehicle-cell"><strong>K-AH-080-IM</strong></div>
            </div>
            <div class="hour-timeline-container">
                <div class="hour-timeline-header">${Array.from({length: 30}, (_, i) => `<div class="day-date-cell">${i+1}/11</div>`).join('')}</div>
                <div class="hour-timeline-body">
                    <div class="hour-category-spacer"></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar rented" style="left:0%;width:100%;" data-vehicle="C-AH-919-BK" data-client="Cliente A" data-contract="#1509661" data-start="01/11/2025" data-end="30/11/2025"><div class="reservation-label">Cliente A - #1509661</div></div></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar rented" style="left:13%;width:47%;" data-vehicle="C-AH-919-BH" data-client="Prepago" data-contract="#06856" data-start="05/11/2025" data-end="18/11/2025"><div class="reservation-label">#06856</div></div></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar reserved" style="left:0%;width:40%;" data-vehicle="C-AH-916-WL" data-client="Prepago" data-contract="#1514206" data-start="01/11/2025" data-end="12/11/2025"><div class="reservation-label">Prepago - #1514206</div></div></div>
                    <div class="hour-category-spacer"></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar reserved" style="left:63%;width:20%;" data-vehicle="H-AH-534-CO" data-client="Prepago XYZ" data-contract="-" data-start="20/11/2025" data-end="25/11/2025"><div class="reservation-label">Prepago XYZ</div></div></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar rented" style="left:0%;width:67%;" data-vehicle="H-AH-287-WG" data-client="SIHORSKI" data-contract="#1504157" data-start="01/11/2025" data-end="20/11/2025"><div class="reservation-label">SIHORSKI - #1504157</div></div></div>
                    <div class="hour-category-spacer"></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar reserved" style="left:70%;width:30%;" data-vehicle="K-AH-080-IM" data-client="Prepago" data-contract="#1628844" data-start="22/11/2025" data-end="30/11/2025"><div class="reservation-label">Prepago - #1628844</div></div></div>
                </div>
            </div>
        </div></div>`;
    }

    renderHourView() {
        return `<div class="hour-view-container"><div class="hour-grid">
            <div class="hour-header-vehicles">
                <div class="hour-header-cell">Vehículo</div>
                <div class="hour-category-label">CATEGORÍA C</div>
                ${['C-AH-919-BK', 'C-AH-919-BH', 'C-AH-916-WL'].map(v => `<div class="hour-vehicle-cell"><strong>${v}</strong></div>`).join('')}
                <div class="hour-category-label">CATEGORÍA H</div>
                ${['H-AH-534-CO', 'H-AH-287-WG'].map(v => `<div class="hour-vehicle-cell"><strong>${v}</strong></div>`).join('')}
                <div class="hour-category-label">CATEGORÍA K</div>
                <div class="hour-vehicle-cell"><strong>K-AH-080-IM</strong></div>
            </div>
            <div class="hour-timeline-container">
                <div class="hour-timeline-header hour-header-grid">
                    ${['Vie 18/11', 'Sáb 19/11', 'Dom 20/11', 'Lun 21/11', 'Mar 22/11'].map((d, i) => `
                        <div class="hour-date-group"${i === 3 ? ' style="background:#fee2e2"' : ''}>
                            <div class="hour-date-label">${d}</div>
                            <div class="hour-slots"><div class="hour-slot">6</div><div class="hour-slot">12</div><div class="hour-slot">18</div><div class="hour-slot">24</div></div>
                        </div>
                    `).join('')}
                </div>
                <div class="hour-timeline-body">
                    <div class="hour-category-spacer"></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar rented" style="left:0%;width:100%;" data-vehicle="C-AH-919-BK" data-client="Cliente A" data-contract="#1509661" data-start="18/11 06:00" data-end="22/11 24:00"><div class="reservation-label">Cliente A - #1509661</div></div></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar rented" style="left:25%;width:55%;" data-vehicle="C-AH-919-BH" data-client="Prepago" data-contract="#06856" data-start="19/11 12:00" data-end="21/11 18:00"><div class="reservation-label">#06856</div></div></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar reserved" style="left:0%;width:30%;" data-vehicle="C-AH-916-WL" data-client="Prepago" data-contract="#1514206" data-start="18/11 08:00" data-end="19/11 18:00"><div class="reservation-label">Prepago - #1514206</div></div></div>
                    <div class="hour-category-spacer"></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar reserved" style="left:52.5%;width:37.5%;" data-vehicle="H-AH-534-CO" data-client="Prepago XYZ" data-contract="-" data-start="20/11 18:00" data-end="22/11 12:00"><div class="reservation-label">Prepago XYZ</div></div></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar rented" style="left:0%;width:62.5%;" data-vehicle="H-AH-287-WG" data-client="SIHORSKI" data-contract="#1504157" data-start="18/11 06:00" data-end="21/11 12:00"><div class="reservation-label">SIHORSKI - #1504157</div></div></div>
                    <div class="hour-category-spacer"></div>
                    <div class="hour-vehicle-row"><div class="reservation-bar reserved" style="left:80%;width:20%;" data-vehicle="K-AH-080-IM" data-client="Prepago" data-contract="#1628844" data-start="22/11 12:00" data-end="22/11 24:00"><div class="reservation-label">Prepago - #1628844</div></div></div>
                </div>
            </div>
        </div></div>`;
    }

    setupEventListeners() {
        const viewModeSelect = this.container.querySelector('#viewMode');
        if (viewModeSelect) {
            viewModeSelect.addEventListener('change', (e) => {
                this.viewMode = e.target.value;
                this.toggleView();
            });
        }

        // Setup modal close buttons
        const modal = this.container.querySelector('#reservationModal');
        const closeBtn = this.container.querySelector('#closeModalBtn');
        const closeBtn2 = this.container.querySelector('#closeModalBtn2');
        
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        if (closeBtn2) closeBtn2.addEventListener('click', () => modal.classList.remove('active'));
        if (modal) modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        // Add click listeners to reservation bars
        this.attachBarListeners();
    }

    attachBarListeners() {
        const bars = this.container.querySelectorAll('.reservation-bar');
        bars.forEach(bar => {
            bar.addEventListener('click', () => {
                const vehicle = bar.getAttribute('data-vehicle');
                const client = bar.getAttribute('data-client');
                const contract = bar.getAttribute('data-contract');
                const start = bar.getAttribute('data-start');
                const end = bar.getAttribute('data-end');
                const isRented = bar.classList.contains('rented');
                
                this.container.querySelector('#detailVehicle').textContent = vehicle;
                this.container.querySelector('#detailClient').textContent = client;
                this.container.querySelector('#detailContract').textContent = contract;
                this.container.querySelector('#detailStart').textContent = start;
                this.container.querySelector('#detailEnd').textContent = end;
                this.container.querySelector('#detailStatus').innerHTML = isRented 
                    ? '<span class="status-badge status-alquilado">Alquilado</span>'
                    : '<span class="status-badge status-reservado">Reservado</span>';
                
                this.container.querySelector('#reservationModal').classList.add('active');
            });
        });
    }

    toggleView() {
        const dayView = this.container.querySelector('#dayView');
        const hourView = this.container.querySelector('#hourView');
        
        if (this.viewMode === 'day') {
            dayView.style.display = 'block';
            hourView.style.display = 'none';
        } else {
            dayView.style.display = 'none';
            hourView.style.display = 'block';
        }

        // Reattach listeners after toggle
        setTimeout(() => this.attachBarListeners(), 100);
    }

    cleanup() {}
}
