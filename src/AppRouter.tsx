import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

type AppRoute = '/' | '/servicios' | '/coberturas' | '/proceso' | '/contacto';

type NavigateFn = (route: AppRoute) => void;

type NavigationItem = {
  href: AppRoute;
  label: string;
};

type RouteButtonLinkProps = {
  to: AppRoute;
  label: string;
  className: string;
  navigate: NavigateFn;
};

type NavigationLinkProps = {
  to: AppRoute;
  label: string;
  currentRoute: AppRoute;
  navigate: NavigateFn;
};

type PageHeroProps = {
  kicker: string;
  title: string;
  lead: string;
  highlights: string[];
  primaryAction: {
    to: AppRoute;
    label: string;
  };
  secondaryAction: {
    to: AppRoute;
    label: string;
  };
  navigate: NavigateFn;
  children: ReactNode;
};

type RouteOverviewSectionProps = {
  currentRoute: AppRoute;
  navigate: NavigateFn;
  title: string;
  description: string;
};

type RouteViewProps = {
  currentRoute: AppRoute;
  navigate: NavigateFn;
};

type ReservationFormData = {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  mensaje: string;
};

type ReservationFormFieldName = keyof ReservationFormData;

const appRoutes: AppRoute[] = ['/', '/servicios', '/coberturas', '/proceso', '/contacto'];

const reservationsApiBaseUrl = (import.meta.env.VITE_API_URL ?? 'http://54.226.0.92:3000').replace(/\/+$/, '');

const reservationServiceOptions = [
  { value: 'asesoria-ecommerce', label: 'Asesoría de ecommerce' },
  { value: 'asesoria-seguros-medicos', label: 'Asesoría de seguros médicos' },
  { value: 'asesoria-seguros-auto', label: 'Asesoría de seguros de auto' },
  { value: 'asesoria-seguros-vida', label: 'Asesoría de seguros de vida' },
  { value: 'asesoria-integral', label: 'Asesoría integral (ecommerce y seguros)' },
  { value: 'otra-reserva', label: 'Otra asesoría' },
] as const;

const defaultReservationFormData: ReservationFormData = {
  nombre: '',
  email: '',
  telefono: '',
  servicio: '',
  fecha: '',
  hora: '',
  mensaje: '',
};

const routeTitles: Record<AppRoute, string> = {
  '/': 'Inicio | Millennium Global Corporativo',
  '/servicios': 'Servicios | Millennium Global Corporativo',
  '/coberturas': 'Coberturas | Millennium Global Corporativo',
  '/proceso': 'Proceso | Millennium Global Corporativo',
  '/contacto': 'Contacto | Millennium Global Corporativo',
};

const navigation: NavigationItem[] = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/coberturas', label: 'Coberturas' },
  { href: '/proceso', label: 'Proceso' },
  { href: '/contacto', label: 'Contacto' },
];

const signals = [
  'Comercializadora de ecommerce',
  'Seguros médicos',
  'Seguros de auto',
  'Seguros de vida',
];

const services = [
  {
    tag: 'Retail digital',
    title: 'Comercializadora de ecommerce',
    description:
      'Selección de catálogo, administración de marketplaces, pricing, contenido, logística y postventa para escalar ventas con orden.',
    meta: ['marketplaces', 'catalogo', 'logistica'],
  },
  {
    tag: 'Salud',
    title: 'Seguros médicos',
    description:
      'Asesoría en planes individuales o familiares, comparación de coberturas, renovaciones y seguimiento documental.',
    meta: ['planes', 'renovacion', 'soporte'],
  },
  {
    tag: 'Movilidad',
    title: 'Seguros de auto',
    description:
      'Cotización, pólizas, flotillas y seguimiento de siniestros con un solo punto de contacto.',
    meta: ['autos', 'flotillas', 'siniestros'],
  },
  {
    tag: 'Protección',
    title: 'Seguros de vida',
    description:
      'Coberturas para familias y empresas, revisión de beneficiarios, plazos y mantenimiento continuo.',
    meta: ['vida', 'familia', 'patrimonio'],
  },
];

const coverage = [
  {
    title: 'Comercio',
    description: 'Canales propios y marketplaces, gestión de inventario y campañas de venta.',
  },
  {
    title: 'Salud',
    description: 'Planes médicos, asistencia y acompañamiento documental.',
  },
  {
    title: 'Auto',
    description: 'Cotización y administración de pólizas para particulares y flotas.',
  },
  {
    title: 'Vida',
    description: 'Protección de ingresos y patrimonio con seguimiento continuo.',
  },
];

const processSteps = [
  {
    title: 'Diagnóstico',
    description:
      'Analizamos la operación comercial o la necesidad de cobertura para definir la mejor ruta.',
  },
  {
    title: 'Propuesta',
    description:
      'Construimos una solución clara, comparativa y alineada con tus objetivos.',
  },
  {
    title: 'Acompañamiento',
    description:
      'Sostenemos la operación con seguimiento, renovación y atención humana.',
  },
];

const overviewCards = [
  {
    href: '/servicios' as AppRoute,
    tag: 'Servicios',
    title: 'Comercialización de ecommerce',
    description: 'Catálogo, marketplaces, pricing y postventa.',
  },
  {
    href: '/coberturas' as AppRoute,
    tag: 'Coberturas',
    title: 'Seguros médicos, auto y vida',
    description: 'Planes, pólizas, renovaciones y acompañamiento.',
  },
  {
    href: '/proceso' as AppRoute,
    tag: 'Proceso',
    title: 'Diagnóstico y seguimiento',
    description: 'Propuesta clara, implementación y soporte.',
  },
  {
    href: '/contacto' as AppRoute,
    tag: 'Contacto',
    title: 'Solicita propuesta',
    description: 'Cuéntanos tu operación y armamos el siguiente paso.',
  },
];

const logoSrc = '/mgc.jpeg';

function isAppRoute(pathname: string): pathname is AppRoute {
  return appRoutes.includes(pathname as AppRoute);
}

function getRouteFromPathname(pathname: string): AppRoute {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  return isAppRoute(normalizedPath) ? normalizedPath : '/';
}

function isPrimaryClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function RouteButtonLink({ to, label, className, navigate }: RouteButtonLinkProps) {
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        if (!isPrimaryClick(event)) {
          return;
        }

        event.preventDefault();
        navigate(to);
      }}
    >
      {label}
    </a>
  );
}

function NavigationLink({ to, label, currentRoute, navigate }: NavigationLinkProps) {
  const isActive = currentRoute === to;

  return (
    <a
      href={to}
      className={`lux-nav__link${isActive ? ' lux-nav__link--active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      onClick={(event) => {
        if (!isPrimaryClick(event)) {
          return;
        }

        event.preventDefault();
        navigate(to);
      }}
    >
      {label}
    </a>
  );
}

function PageHero({
  kicker,
  title,
  lead,
  highlights,
  primaryAction,
  secondaryAction,
  navigate,
  children,
}: PageHeroProps) {
  return (
    <section className="lux-hero">
      <div className="lux-hero__copy">
        <p className="lux-kicker">{kicker}</p>
        <h1 className="lux-title">{title}</h1>
        <p className="lux-lede">{lead}</p>

        <div className="lux-actions">
          <RouteButtonLink
            to={primaryAction.to}
            label={primaryAction.label}
            className="lux-button lux-button--solid"
            navigate={navigate}
          />
          <RouteButtonLink
            to={secondaryAction.to}
            label={secondaryAction.label}
            className="lux-button lux-button--outline"
            navigate={navigate}
          />
        </div>

        <ul className="lux-signals" aria-label="Líneas principales">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>

      <aside className="lux-hero__visual" aria-label={`${kicker} resumen`}>
        {children}
      </aside>
    </section>
  );
}

function RouteOverviewSection({ currentRoute, navigate, title, description }: RouteOverviewSectionProps) {
  return (
    <section className="lux-section">
      <div className="lux-section__head">
        <p className="lux-section__label">Mapa del sitio</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="lux-service-grid">
        {overviewCards.map((card) => {
          const isCurrent = currentRoute === card.href;

          return (
            <article key={card.href} className="lux-service-card">
              <p className="lux-service-card__tag">{card.tag}</p>
              <div>
                <h3 className="lux-service-card__title">{card.title}</h3>
                <p className="lux-service-card__text">{card.description}</p>
              </div>
              <div className="lux-service-card__meta">
                <RouteButtonLink
                  to={card.href}
                  label={isCurrent ? 'Vista actual' : 'Abrir vista'}
                  className="lux-button lux-button--outline"
                  navigate={navigate}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HomeView({ currentRoute, navigate }: RouteViewProps) {
  return (
    <>
      <PageHero
        kicker="Millennium Global Corporativo"
        title="Ecommerce y seguros con una presentación limpia y una operación ordenada."
        lead="Comercializamos soluciones de ecommerce y gestionamos seguros médicos, de auto y de vida. Un solo equipo para estructurar ventas, coberturas y seguimiento con claridad."
        highlights={signals}
        primaryAction={{ to: '/servicios', label: 'Ver servicios' }}
        secondaryAction={{ to: '/coberturas', label: 'Coberturas' }}
        navigate={navigate}
      >
        <article className="lux-visual-card lux-visual-card--feature">
          <p className="lux-visual-card__eyebrow">01 / Portafolio</p>
          <h2>Una operación para vender mejor y proteger mejor.</h2>
          <p>
            Comercio digital, seguimiento de pólizas, atención documental y soporte comercial en
            una misma narrativa.
          </p>
        </article>

        <div className="lux-visual-stack">
          <article className="lux-visual-card">
            <span>Comercializadora</span>
            <strong>Ecommerce</strong>
            <p>Catálogo, marketplaces, logística, pricing y postventa.</p>
          </article>
          <article className="lux-visual-card">
            <span>Cobertura</span>
            <strong>Seguros</strong>
            <p>Médicos, auto y vida con acompañamiento consultivo.</p>
          </article>
        </div>
      </PageHero>

      <RouteOverviewSection
        currentRoute={currentRoute}
        navigate={navigate}
        title="Acceso rápido a cada área"
        description="Entra directo a la vista que necesitas sin perder la información clave del negocio."
      />
    </>
  );
}

function ServicesView({ currentRoute, navigate }: RouteViewProps) {
  return (
    <>
      <PageHero
        kicker="Servicios"
        title="Comercialización de ecommerce para marcas que necesitan orden y velocidad."
        lead="Administramos catálogo, marketplaces, pricing y postventa, con una operación que también puede conectarse con coberturas y seguimiento empresarial."
        highlights={services.map((service) => service.tag)}
        primaryAction={{ to: '/contacto', label: 'Solicitar propuesta' }}
        secondaryAction={{ to: '/coberturas', label: 'Ver coberturas' }}
        navigate={navigate}
      >
        <article className="lux-visual-card lux-visual-card--feature">
          <p className="lux-visual-card__eyebrow">02 / Operación</p>
          <h2>Catálogo, marketplaces y postventa.</h2>
          <p>
            Estructuramos el flujo comercial para que la venta digital sea clara, medible y fácil
            de sostener.
          </p>
        </article>

        <div className="lux-visual-stack">
          <article className="lux-visual-card">
            <span>Ventas</span>
            <strong>Marketplaces</strong>
            <p>Publicación, control y seguimiento del catálogo.</p>
          </article>
          <article className="lux-visual-card">
            <span>Soporte</span>
            <strong>Postventa</strong>
            <p>Atención, trazabilidad y continuidad comercial.</p>
          </article>
        </div>
      </PageHero>

      <section className="lux-section" aria-labelledby="servicios-title">
        <div className="lux-section__head">
          <p className="lux-section__label">Servicios</p>
          <h2 id="servicios-title">Lo que hacemos para ecommerce y comercialización.</h2>
          <p>
            El objetivo es que cada operación tenga dirección, catálogo limpio y capacidad de
            escalar sin perder el control.
          </p>
        </div>

        <div className="lux-service-grid">
          {services.map((service) => (
            <article key={service.title} className="lux-service-card">
              <p className="lux-service-card__tag">{service.tag}</p>
              <div>
                <h3 className="lux-service-card__title">{service.title}</h3>
                <p className="lux-service-card__text">{service.description}</p>
              </div>
              <div className="lux-service-card__meta" aria-label={`Detalle de ${service.title}`}>
                {service.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <RouteOverviewSection
        currentRoute={currentRoute}
        navigate={navigate}
        title="Sigue explorando el sitio"
        description="Puedes moverte a coberturas, proceso o contacto para ver el resto del contenido de la marca."
      />
    </>
  );
}

function CoverageView({ currentRoute, navigate }: RouteViewProps) {
  return (
    <>
      <PageHero
        kicker="Coberturas"
        title="Gestión de seguros médicos, de auto y de vida con seguimiento continuo."
        lead="Te ayudamos a comparar, contratar, renovar y dar seguimiento a las pólizas, con una experiencia clara desde el primer contacto."
        highlights={['Planes médicos', 'Autos', 'Vida', 'Renovación']}
        primaryAction={{ to: '/contacto', label: 'Solicitar asesoría' }}
        secondaryAction={{ to: '/proceso', label: 'Ver proceso' }}
        navigate={navigate}
      >
        <article className="lux-visual-card lux-visual-card--feature">
          <p className="lux-visual-card__eyebrow">03 / Protección</p>
          <h2>Salud, movilidad y patrimonio.</h2>
          <p>
            Centralizamos las coberturas para que la administración sea simple y el seguimiento no
            dependa de múltiples frentes.
          </p>
        </article>

        <div className="lux-visual-stack">
          <article className="lux-visual-card">
            <span>Salud</span>
            <strong>Médicos</strong>
            <p>Planes individuales, familiares y renovaciones.</p>
          </article>
          <article className="lux-visual-card">
            <span>Movilidad</span>
            <strong>Auto y flotillas</strong>
            <p>Cotización, pólizas y seguimiento de siniestros.</p>
          </article>
        </div>
      </PageHero>

      <section className="lux-section lux-section--split" aria-labelledby="coberturas-title">
        <div className="lux-section__head lux-section__head--narrow">
          <p className="lux-section__label">Coberturas</p>
          <h2 id="coberturas-title">Las líneas que gestionamos para tu protección.</h2>
          <p>
            Desde salud hasta patrimonio, el proceso está pensado para darte acompañamiento humano
            y claridad operativa.
          </p>
        </div>

        <div className="lux-coverage">
          {coverage.map((item) => (
            <article key={item.title} className="lux-coverage__item">
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <RouteOverviewSection
        currentRoute={currentRoute}
        navigate={navigate}
        title="Sigue navegando"
        description="También puedes revisar el proceso de atención o volver al inicio para ver el panorama completo."
      />
    </>
  );
}

function ProcessView({ currentRoute, navigate }: RouteViewProps) {
  return (
    <>
      <PageHero
        kicker="Proceso"
        title="Diagnóstico, propuesta y acompañamiento para ecommerce y seguros."
        lead="La ruta está pensada para que la operación avance de manera clara y sin fricción, desde la primera lectura hasta el seguimiento continuo."
        highlights={processSteps.map((step) => step.title)}
        primaryAction={{ to: '/servicios', label: 'Ver servicios' }}
        secondaryAction={{ to: '/contacto', label: 'Contactar' }}
        navigate={navigate}
      >
        <article className="lux-visual-card lux-visual-card--feature">
          <p className="lux-visual-card__eyebrow">04 / Flujo</p>
          <h2>Una ruta breve y ordenada.</h2>
          <p>
            Trabajamos con un esquema corto para que el negocio avance con claridad y sin exceso de
            complejidad.
          </p>
        </article>

        <div className="lux-visual-stack">
          <article className="lux-visual-card">
            <span>Lectura</span>
            <strong>Diagnóstico</strong>
            <p>Entender la operación y definir el punto de partida.</p>
          </article>
          <article className="lux-visual-card">
            <span>Seguimiento</span>
            <strong>Acompañamiento</strong>
            <p>Dar continuidad a la ejecución y a la renovación.</p>
          </article>
        </div>
      </PageHero>

      <section className="lux-section" aria-labelledby="proceso-title">
        <div className="lux-section__head">
          <p className="lux-section__label">Proceso</p>
          <h2 id="proceso-title">El recorrido que seguimos para avanzar contigo.</h2>
          <p>
            Un flujo simple para que cada paso tenga dueño, objetivo y seguimiento.
          </p>
        </div>

        <ol className="lux-process">
          {processSteps.map((step, index) => (
            <li key={step.title} className="lux-process__step">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <RouteOverviewSection
        currentRoute={currentRoute}
        navigate={navigate}
        title="Ver también otras áreas"
        description="Si quieres revisar servicios, coberturas o contacto, puedes cambiar de vista desde aquí."
      />
    </>
  );
}

function ContactView({ currentRoute, navigate }: RouteViewProps) {
  const [reservationFormData, setReservationFormData] = useState<ReservationFormData>(
    defaultReservationFormData,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const today = new Date();
  const minReservationDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const fieldName = event.target.name as ReservationFormFieldName;

    setReservationFormData((previousFormData) => ({
      ...previousFormData,
      [fieldName]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const response = await fetch(`${reservationsApiBaseUrl}/api/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationFormData),
      });

      const responseBody = (await response.json().catch(() => null)) as
        | { error?: string; message?: string }
        | null;

      if (!response.ok) {
        throw new Error(responseBody?.error ?? 'No se pudo enviar la reserva. Intenta nuevamente.');
      }

      setReservationFormData(defaultReservationFormData);
      setSubmitSuccess(responseBody?.message ?? 'Tu reserva fue enviada correctamente.');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No se pudo enviar la reserva. Intenta nuevamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        kicker="Reservas"
        title="Reserva tu asesoría para ecommerce o seguros en una sola agenda."
        lead="Elige tipo de asesoría, fecha y hora preferida. Nuestro equipo confirma la reserva y te acompaña en el siguiente paso."
        highlights={['Agenda tu cita', 'Confirmación rápida', 'Asesoría personalizada']}
        primaryAction={{ to: '/servicios', label: 'Ver servicios' }}
        secondaryAction={{ to: '/proceso', label: 'Ver proceso' }}
        navigate={navigate}
      >
        <article className="lux-visual-card lux-visual-card--feature">
          <p className="lux-visual-card__eyebrow">05 / Reserva</p>
          <h2>Agenda tu asesoría en minutos.</h2>
          <p>
            Selecciona disponibilidad y tipo de consulta para preparar una sesión enfocada en tu
            necesidad.
          </p>
        </article>

        <div className="lux-visual-stack">
          <article className="lux-visual-card">
            <span>Agenda</span>
            <strong>Fecha y hora</strong>
            <p>Propones horario y confirmamos disponibilidad.</p>
          </article>
          <article className="lux-visual-card">
            <span>Sesión</span>
            <strong>Asesoría</strong>
            <p>Entramos directo a resolver tu caso de ecommerce o seguros.</p>
          </article>
        </div>
      </PageHero>

      <section className="lux-contact" id="contacto" aria-labelledby="contacto-title">
        <div className="lux-contact__copy">
          <p className="lux-section__label">Reservaciones</p>
          <h2 id="contacto-title">Reserva tu asesoría y aparta tu horario.</h2>
          <p>
            Indica el tipo de asesoría, una fecha y hora preferida. Te confirmaremos la cita para
            iniciar.
          </p>

          <div className="lux-contact__actions">
            <RouteButtonLink
              to="/servicios"
              label="Ver servicios"
              className="lux-button lux-button--solid"
              navigate={navigate}
            />
            <RouteButtonLink
              to="/"
              label="Volver al inicio"
              className="lux-button lux-button--outline"
              navigate={navigate}
            />
          </div>
        </div>

        <form className="lux-contact-form" onSubmit={handleSubmit} noValidate>
          <div className="lux-contact-form__grid">
            <label className="lux-contact-form__field" htmlFor="reservation-nombre">
              <span>Nombre completo *</span>
              <input
                id="reservation-nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                minLength={2}
                maxLength={80}
                required
                value={reservationFormData.nombre}
                onChange={handleFieldChange}
              />
            </label>

            <label className="lux-contact-form__field" htmlFor="reservation-email">
              <span>Correo electrónico *</span>
              <input
                id="reservation-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={120}
                required
                value={reservationFormData.email}
                onChange={handleFieldChange}
              />
            </label>

            <label className="lux-contact-form__field" htmlFor="reservation-telefono">
              <span>Teléfono</span>
              <input
                id="reservation-telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                maxLength={30}
                value={reservationFormData.telefono}
                onChange={handleFieldChange}
              />
            </label>

            <label className="lux-contact-form__field" htmlFor="reservation-servicio">
              <span>Tipo de asesoría *</span>
              <select
                id="reservation-servicio"
                name="servicio"
                required
                value={reservationFormData.servicio}
                onChange={handleFieldChange}
              >
                <option value="">Selecciona una asesoría</option>
                {reservationServiceOptions.map((serviceType) => (
                  <option key={serviceType.value} value={serviceType.value}>
                    {serviceType.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="lux-contact-form__field" htmlFor="reservation-fecha">
              <span>Fecha de reserva *</span>
              <input
                id="reservation-fecha"
                name="fecha"
                type="date"
                min={minReservationDate}
                required
                value={reservationFormData.fecha}
                onChange={handleFieldChange}
              />
            </label>

            <label className="lux-contact-form__field" htmlFor="reservation-hora">
              <span>Hora de reserva *</span>
              <input
                id="reservation-hora"
                name="hora"
                type="time"
                required
                value={reservationFormData.hora}
                onChange={handleFieldChange}
              />
            </label>
          </div>

          <label className="lux-contact-form__field lux-contact-form__field--full" htmlFor="reservation-mensaje">
            <span>Cuéntanos qué necesitas *</span>
            <textarea
              id="reservation-mensaje"
              name="mensaje"
              rows={5}
              minLength={10}
              maxLength={1200}
              required
              value={reservationFormData.mensaje}
              onChange={handleFieldChange}
            />
          </label>

          <div className="lux-contact-form__footer">
            <p
              className={`lux-contact-form__status${submitError ? ' lux-contact-form__status--error' : ''}${submitSuccess ? ' lux-contact-form__status--success' : ''}`}
              role="status"
              aria-live="polite"
            >
              {submitError ||
                submitSuccess ||
                'Comparte tu disponibilidad y confirmaremos tu reserva en menos de 24 horas.'}
            </p>

            <button className="lux-button lux-button--solid" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Reservando...' : 'Reservar asesoría'}
            </button>
          </div>
        </form>
      </section>

      <RouteOverviewSection
        currentRoute={currentRoute}
        navigate={navigate}
        title="Explora las demás vistas"
        description="Puedes regresar al inicio o saltar a servicios, coberturas y proceso cuando quieras."
      />
    </>
  );
}

export default function AppRouter() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => getRouteFromPathname(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromPathname(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    document.title = routeTitles[currentRoute];
    window.scrollTo(0, 0);
  }, [currentRoute]);

  const navigate = (nextRoute: AppRoute) => {
    if (nextRoute === currentRoute) {
      window.scrollTo(0, 0);
      return;
    }

    window.history.pushState({}, '', nextRoute);
    setCurrentRoute(nextRoute);
  };

  let content: ReactNode;

  switch (currentRoute) {
    case '/servicios':
      content = <ServicesView currentRoute={currentRoute} navigate={navigate} />;
      break;
    case '/coberturas':
      content = <CoverageView currentRoute={currentRoute} navigate={navigate} />;
      break;
    case '/proceso':
      content = <ProcessView currentRoute={currentRoute} navigate={navigate} />;
      break;
    case '/contacto':
      content = <ContactView currentRoute={currentRoute} navigate={navigate} />;
      break;
    default:
      content = <HomeView currentRoute={currentRoute} navigate={navigate} />;
      break;
  }

  return (
    <div className="lux-page">
      <div className="lux-halo lux-halo-left" />
      <div className="lux-halo lux-halo-right" />

      <header className="lux-topbar">
        <div className="lux-brand-group">
          <a
            className="lux-brand"
            href="/"
            aria-label="Millennium Global Corporativo"
            onClick={(event) => {
              if (!isPrimaryClick(event)) {
                return;
              }

              event.preventDefault();
              navigate('/');
            }}
          >
            <span className="lux-brand__mark lux-brand__mark--logo">
              <img className="lux-brand__image" src={logoSrc} alt="Logo Millennium Global Corporativo" />
            </span>
            <span className="lux-brand__copy">
              <strong>Millennium Global Corporativo</strong>
              <span>Ecommerce y seguros</span>
            </span>
          </a>
        </div>

        <nav className="lux-nav" aria-label="Principal">
          {navigation.map((item) => (
            <NavigationLink
              key={item.href}
              to={item.href}
              label={item.label}
              currentRoute={currentRoute}
              navigate={navigate}
            />
          ))}
        </nav>
      </header>

      <main className="lux-shell" id="top">
        {content}

        <footer className="lux-footer">
          <span>Millennium Global Corporativo</span>
          <span>Ecommerce · Salud · Auto · Vida</span>
        </footer>
      </main>
    </div>
  );
}
