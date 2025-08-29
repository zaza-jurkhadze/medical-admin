/*"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../app/styles/globals.css';
import '../app/styles/responsive.css';

const BRAND_COLOR = '#EC7C19';
const ITEMS_PER_PAGE = 4;

export default function Services() {
  const [servicesData, setServicesData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [randomServices, setRandomServices] = useState([]);
  const router = useRouter();

  // MongoDB-დან სერვისების წამოღება
  const fetchServices = async () => {
    try {
      const res = await fetch('/api/servicesData'); // შენს MongoDB API
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      setServicesData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert('სერვისების წამოღება ვერ მოხერხდა');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // სერვისების ფილტრაცია
  const filteredServices = useMemo(() => {
    return servicesData.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, servicesData]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

  const paginatedServices = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(start, start + ITEMS_PER_PAGE);
  }, [page, filteredServices]);

  // შემთხვევითი სერვისები მთავარი გვერდისთვის
  useEffect(() => {
    if (showAll || searchTerm) return;
    const changeRandom = () => {
      const shuffled = [...servicesData].sort(() => 0.5 - Math.random());
      setRandomServices(shuffled.slice(0, 4));
    };
    changeRandom();
    const interval = setInterval(changeRandom, 5000);
    return () => clearInterval(interval);
  }, [showAll, searchTerm, servicesData]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filteredServices, page, totalPages]);

  return (
    <section id='services' className="services-section">
      <h2>სერვისები</h2>
      <p>
        აქ მიიღებთ უმაღლესი ხარისხის სამედიცინო მომსახურებას პროფესიონალებისგან.<br/>
        თქვენზე ზრუნავს მაღალკვალიფიციური პერსონალი თბილ და კომფორტულ გარემოში.
      </p>

      <input
        type="text"
        placeholder="მოძებნეთ სერვისი..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onFocus={e => e.target.style.borderColor = BRAND_COLOR}
        onBlur={e => e.target.style.borderColor = '#ddd'}
      />

      <div className="services-grid">
        {(showAll || searchTerm ? paginatedServices : randomServices).map(service => (
          <div key={service._id || service.id} className="service-card">
            <div className="icon">
              <Image
                src={service.image || service.icon || '/img/icons/default.jpg'}
                alt={service.name}
                width={50}
                height={50}
                style={{ objectFit: 'contain', filter: 'invert(32%) sepia(99%) saturate(7482%) hue-rotate(203deg) brightness(99%) contrast(101%)'}}       
              />
            </div>
            <a
              onClick={() => router.push(`/services/${service.slugId}`)}
              className="service-link"
              style={{ cursor: "pointer" }}
            >
              {service.name}
            </a>
          </div>
        ))}
      </div>

      {showAll && totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>&lt;</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>&gt;</button>
        </div>
      )}

      {!showAll && !searchTerm && (
        <button className="show-all-btn" onClick={() => setShowAll(true)}>ყველა სერვისი</button>
      )}

      {(showAll || searchTerm) && (
        <button className="show-less-btn" onClick={() => { setShowAll(false); setSearchTerm(''); }}>ნაკლები სერვისი</button>
      )}
    </section>
  );
}*/

"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../app/styles/globals.css';
import '../app/styles/responsive.css';

const BRAND_COLOR = '#EC7C19';
const ITEMS_PER_PAGE = 4;

export default function Services() {
  const [servicesData, setServicesData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [randomServices, setRandomServices] = useState([]);
  const router = useRouter();

  // MongoDB-დან სერვისების წამოღება
  const fetchServices = async () => {
    try {
      const res = await fetch('/api/servicesData'); 
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      setServicesData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert('სერვისების წამოღება ვერ მოხერხდა');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // სერვისების ფილტრაცია
  const filteredServices = useMemo(() => {
    return servicesData.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, servicesData]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

  const paginatedServices = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(start, start + ITEMS_PER_PAGE);
  }, [page, filteredServices]);

  // შემთხვევითი სერვისები მთავარი გვერდისთვის
  useEffect(() => {
    if (showAll || searchTerm) return;
    const changeRandom = () => {
      const shuffled = [...servicesData].sort(() => 0.5 - Math.random());
      setRandomServices(shuffled.slice(0, 4));
    };
    changeRandom();
    const interval = setInterval(changeRandom, 5000);
    return () => clearInterval(interval);
  }, [showAll, searchTerm, servicesData]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filteredServices, page, totalPages]);

  return (
    <section id='services' className="services-section">
      <h2>სერვისები</h2>
      <p>
        აქ მიიღებთ უმაღლესი ხარისხის სამედიცინო მომსახურებას პროფესიონალებისგან.<br/>
        თქვენზე ზრუნავს მაღალკვალიფიციური პერსონალი თბილ და კომფორტულ გარემოში.
      </p>

      <input
        type="text"
        placeholder="მოძებნეთ სერვისი..."
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value);
          setPage(1); // ძებნისას ყოველთვის პირველი გვერდი
        }}
        onFocus={e => e.target.style.borderColor = BRAND_COLOR}
        onBlur={e => e.target.style.borderColor = '#ddd'}
      />

      <div className="services-grid">
        {(showAll || searchTerm ? paginatedServices : randomServices).map(service => (
          <div key={service._id || service.id} className="service-card">
            <div className="icon">
              <Image
                src={service.image || service.icon || '/img/icons/default.jpg'}
                alt={service.name}
                width={50}
                height={50}
                style={{ objectFit: 'contain', filter: 'invert(32%) sepia(99%) saturate(7482%) hue-rotate(203deg) brightness(99%) contrast(101%)'}}       
              />
            </div>
            <a
              onClick={() => router.push(`/services/${service.slugId}`)}
              className="service-link"
              style={{ cursor: "pointer" }}
            >
              {service.name}
            </a>
          </div>
        ))}
      </div>

      {/* Pagination გამოჩნდეს როგორც ძებნისას, ასევე "ყველა სერვისის" ღილაკზე */}
      {( (showAll || searchTerm) && totalPages > 1 ) && (
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>&lt;</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>&gt;</button>
        </div>
      )}

      {!showAll && !searchTerm && (
        <button className="show-all-btn" onClick={() => setShowAll(true)}>ყველა სერვისი</button>
      )}

      {(showAll || searchTerm) && (
        <button className="show-less-btn" onClick={() => { setShowAll(false); setSearchTerm(''); }}>ნაკლები სერვისი</button>
      )}
    </section>
  );
}
