import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../styles/style.css';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

const Pago = () => {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [mesesPagados, setMesesPagados] = useState(1);
    const [precioPaquete, setPrecioPaquete] = useState(0);
    const [descripcionTicket, setDescripcionTicket] = useState('');

    // Cargar clientes desde backend
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/clientes');
                if (res.ok) {
                    const data = await res.json();
                    setClientes(data);
                }
            } catch (err) {
                console.error('Error en la petición:', err);
            }
        };
        fetchClientes();
    }, []);

    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleSeleccionarCliente = (cliente) => {
        setClienteSeleccionado(cliente);
        setPrecioPaquete(cliente.costo_paquete);
        setDescripcionTicket('');
    };

    const handleCancelar = () => {
        setClienteSeleccionado(null);
        setMesesPagados(1);
        setPrecioPaquete(0);
        setDescripcionTicket('');
    };

    // Función para generar PDF
    const generarPDF = (ticketData) => {
        const doc = new jsPDF();
        
        // --- Encabezado ---
        doc.setFontSize(10);
        doc.text("FACTURA", 15, 20);
        doc.text(`Factura n.º: ${ticketData.factura_numero}`, 15, 25);
        doc.text(`Fecha: ${ticketData.fecha}`, 15, 30);

        // --- Datos del cliente ---
        doc.setLineWidth(0.5);
        doc.line(15, 45, 195, 45);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(ticketData.cliente_nombre.toUpperCase(), 15, 55);
        doc.setFont("helvetica", "normal");
        doc.text(`(${ticketData.cliente_telefono})`, 15, 60);
        doc.text(ticketData.cliente_direccion, 15, 65);
        
        // --- Tabla de artículos ---
        const tableData = ticketData.items.map(item => [
            item.articulo,
            item.cantidad,
            `$${item.precio.toFixed(2)}`,
            `$${(item.cantidad * item.precio).toFixed(2)}`
        ]);
        
        autoTable(doc, {
            startY: 85,
            head: [['Artículo', 'Cantidad', 'Precio', 'Total']],
            body: tableData,
            theme: 'plain',
            styles: { cellPadding: 2, fontSize: 10 },
            headStyles: { fillColor: '#ffffff', textColor: '#000000', fontStyle: 'bold' },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { halign: 'right' },
                2: { halign: 'right' },
                3: { halign: 'right' }
            },
            didParseCell: function (data) {
                if (data.section === 'head') {
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        // Calcular el subtotal de los ítems
        const subtotal = ticketData.items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
        let finalY = doc.lastAutoTable.finalY;

        // --- Totales ---
        doc.setFontSize(10);
        doc.line(145, finalY + 5, 195, finalY + 5);
        finalY += 10;
        
        doc.text("Subtotal:", 170, finalY, { align: 'right' });
        doc.text(`$${subtotal.toFixed(2)}`, 195, finalY, { align: 'right' });
        finalY += 7;
        
        doc.text("Impuestos (0%):", 170, finalY, { align: 'right' });
        doc.text("$0", 195, finalY, { align: 'right' });
        finalY += 10;
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Total:", 170, finalY, { align: 'right' });
        doc.text(`$${subtotal.toFixed(2)}`, 195, finalY, { align: 'right' });
        
        // --- Descripción del ticket (nueva ubicación) ---
        finalY += 20;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Descripción del servicio:", 15, finalY);
        finalY += 5;
        doc.text(ticketData.descripcion, 15, finalY);

        // --- Pie de página y contacto (personaliza esto con la información de tu negocio) ---
        finalY += 30;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("¡Gracias por su compra!", 15, finalY);
        finalY += 15;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Información de pago", 15, finalY);
        doc.text("Contacto", 120, finalY);
        finalY += 5;
        doc.line(15, finalY, 195, finalY);
        finalY += 5;

        doc.text("Nombre de tu Negocio", 15, finalY);
        doc.text("Tu Teléfono", 120, finalY);
        finalY += 5;
        doc.text("Tu Banco", 15, finalY);
        doc.text("Tu Email", 120, finalY);
        finalY += 5;
        doc.text("Tu Cuenta: XXXXXX", 15, finalY);
        doc.text("Tu Dirección", 120, finalY);
        finalY += 5;
        doc.text(`Fecha de pago: ${ticketData.fecha_pago}`, 15, finalY);
        finalY += 5;
        doc.text("Tu Sitio Web", 120, finalY);

        doc.save(`factura_${ticketData.cliente_nombre}.pdf`);
    };

    // Generar pago y ticket
    const handleGenerarPago = async () => {
        if (!clienteSeleccionado) {
            alert("Selecciona un cliente");
            return;
        }
        if (!mesesPagados || !precioPaquete) {
            alert("Completa los datos del pago");
            return;
        }
        if (!descripcionTicket.trim()) {
            alert("Ingresa la descripción del ticket");
            return;
        }

        const nuevoPagoYTicket = {
            cliente_id: clienteSeleccionado.id_clientes,
            fecha_pago: new Date().toISOString().split('T')[0],
            meses_pagados: mesesPagados,
            precio_paquete: precioPaquete,
            descripcion: descripcionTicket,
            estado: "Abierto"
        };

        try {
            const res = await fetch('http://localhost:3001/api/pagos-tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoPagoYTicket)
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Error del servidor:', errorData);
                alert(errorData.mensaje || 'Error al registrar pago y ticket');
            } else {
                const data = await res.json();
                const invoiceData = {
                    factura_numero: data.id_ticket, 
                    fecha: new Date().toLocaleDateString('es-ES'),
                    cliente_nombre: clienteSeleccionado.nombre,
                    cliente_telefono: clienteSeleccionado.telefono,
                    cliente_direccion: clienteSeleccionado.direccion,
                    fecha_pago: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
                    descripcion: descripcionTicket, // <-- Se añade aquí
                    items: [
                        { articulo: "Servicio de Internet", cantidad: mesesPagados, precio: precioPaquete },
                    ]
                };
                
                generarPDF(invoiceData);

                alert(`Pago y ticket registrados para ${clienteSeleccionado.nombre}`);
                handleCancelar();
            }
        } catch (err) {
            console.error('Error en la petición:', err);
            alert('Error en la petición al servidor. Por favor, revisa la consola para más detalles.');
        }
    };

    return (
        <div className="cliente-container">
            <nav className="cliente-navbar">
                <img src="/IMG/logoblanco.png" alt="Logo" className="cliente-logo" />
                <ul>
                    <li><Link to="/Dashboard">Dashboard</Link></li>
                    <li><Link to="/nuevo-cliente">Nuevo cliente</Link></li>
                    <li><Link to="/Pago">Pagos</Link></li>
                    <li><Link to="/ListadoClientes">Clientes</Link></li>
                    <li><Link to="/CorteDelDia">Cortes</Link></li>
                </ul>
                <div className="cliente-user-icon">
                    <Link to="/PerfilUsuario">
                        Mi cuenta
                        <img src="/IMG/usuario.png" alt="Ícono de perfil" />
                    </Link>
                </div>
            </nav>

            <h2 className="cliente-title">Pago</h2>

            {!clienteSeleccionado && (
                <>
                    <div className="busqueda-container">
                        <input
                            type="text"
                            placeholder="Buscar cliente por nombre..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="busqueda-input"
                        />
                    </div>

                    <table className="cliente-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Fecha de pago</th>
                                <th>Dirección IP</th>
                                <th>Conexión</th>
                                <th>Costo paquete</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientesFiltrados.map((cliente, index) => (
                                <tr key={index}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.fecha_pago?.split('T')[0]}</td>
                                    <td>{cliente.ip}</td>
                                    <td>{cliente.conexion}</td>
                                    <td>{cliente.costo_paquete}</td>
                                    <td>
                                        <button
                                            className="btn-guardar"
                                            onClick={() => handleSeleccionarCliente(cliente)}
                                        >
                                            Seleccionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {clienteSeleccionado && (
                <div className="ticket-resultado">
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Cliente seleccionado: {clienteSeleccionado.nombre}</h3>
                    <div className="form-column" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                        <label>
                            Precio paquete:
                            <input
                                type="number"
                                value={precioPaquete}
                                onChange={(e) => setPrecioPaquete(parseFloat(e.target.value))}
                                className="ticket-input"
                            />
                        </label>
                        <label>
                            Meses pagados:
                            <input
                                type="number"
                                value={mesesPagados}
                                onChange={(e) => setMesesPagados(parseInt(e.target.value))}
                                min="1"
                                className="ticket-input"
                            />
                        </label>
                        <label>
                            Descripción del ticket:
                            <input
                                type="text"
                                value={descripcionTicket}
                                onChange={(e) => setDescripcionTicket(e.target.value)}
                                className="ticket-input"
                            />
                        </label>
                    </div>
                    <div className="form-buttons">
                        <button className="btn-guardar" onClick={handleGenerarPago}>
                            Generar Pago y Ticket (descargar PDF)
                        </button>
                        <button className="btn-cancelar" onClick={handleCancelar}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pago;