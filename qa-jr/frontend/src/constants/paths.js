export const SETTINGS = "/configuracao"
export const DASHBOARD = "/dashboard"
export const RECOVERY = "/recuperar-senha"
export const FORGOT = "/esqueci-a-senha"
export const MAP = "/mapa"
export const ROUTES = "/rotas"
export const REPORT = "/relatorio"
export const FUEL = "/abastecimento"
export const REGISTERS = "/registros"
export const CONSUMPTION = "/consumo"
export const COSTS = "/custos"
export const KM = "/km"
export const CHECKLIST = "/checklist"
export const VEHICLE_STATUS = "/statusDosVeiculos"
export const PRODUCTIVITY = "/produtividade"
export const AUDIT = "/auditoria"
export const EVENTS = "/eventos"
export const DRIVER = "/motorista"
export const DRIVERS = "/motoristas"
export const DRIVERS_PER_DAY = "/porDia"
export const DRIVERS_PER_ROUTE = "/porRota"
export const DRIVERS_ALL = "/todos"
export const EXPORTS = "/exportacao"
export const VEHICLE = "/veiculo"
export const MANAGE = "/gerenciar"
export const CREATE = "/criar"
export const EDIT = "/editar"
export const GROUPS = "/grupos"
export const FENCES = "/cercas"
export const COMMANDS = "/comandos"
export const USERS = "/usuarios"
export const PDF = "/pdf"
export const DETAILED = "/detalhado"
export const FINANCIAL = "/financeiro"
export const LOGIN_PATH = "/login"
export const CLIENTS = "/clientes"
export const PLACES = "/locais"
export const LOGISTICS_SERVICES = "/servicos"
export const LOGISTICS = "/logistico"
export const SOLICITATIONS = "/solicitacoes"
export const USAGE_ACHIEVEMENT = "/aproveitamento"
export const GOOGLE_MAPS_URL = "https://www.google.com.br/maps/preview?q="

export const SETTINGS_PATH = SETTINGS
export const DASHBOARD_PATH = DASHBOARD

//  ------ LOGIN ------ 
export const LOGIN_RECOVERY_PATH = LOGIN_PATH + RECOVERY
export const LOGIN_FORGOT_PATH = LOGIN_PATH + FORGOT
export const LOGIN_DRIVER_PATH = LOGIN_PATH + DRIVER

//  ------ MAP ------ 
export const MAP_PATH = MAP
export const MAP_ROUTES_PATH = MAP_PATH + ROUTES


//  ------ REPORTS ------ 
export const REPORT_PATH = REPORT

export const REPORT_FUEL_PATH = REPORT_PATH + FUEL
export const REPORT_REGISTERS_FUEL_PATH = REPORT_FUEL_PATH + REGISTERS
export const REPORT_CONSUMPTION_FUEL_PATH = REPORT_FUEL_PATH + CONSUMPTION
export const REPORT_COSTS_FUEL_PATH = REPORT_FUEL_PATH + COSTS

export const REPORT_KM_PATH = REPORT_PATH + KM

export const REPORT_CHECKLIST_PATH = REPORT_PATH + CHECKLIST

export const REPORT_ROUTES_PATH = REPORT_PATH + ROUTES
export const REPORT_ROUTES_DETAILED_PATH = REPORT_PATH + ROUTES + DETAILED

export const REPORT_VEHICLE_STATUS_PATH = REPORT_PATH + VEHICLE_STATUS

export const REPORT_PRODUCTIVITY_PATH = REPORT_PATH + PRODUCTIVITY

export const REPORT_AUDIT_PATH = REPORT_PATH + AUDIT

export const REPORT_EVENTS_PATH = REPORT_PATH + EVENTS

export const REPORT_DRIVERS_PATH = REPORT_PATH + DRIVERS
export const REPORT_DRIVERS_PER_DAY_PATH = REPORT_DRIVERS_PATH + DRIVERS_PER_DAY
export const REPORT_DRIVERS_PER_ROUTE_PATH = REPORT_DRIVERS_PATH + DRIVERS_PER_ROUTE
export const REPORT_DRIVERS_ALL_PATH = REPORT_DRIVERS_PATH + DRIVERS_ALL

//  ------ EXPORTS ------ 
export const EXPORT_PDF = PDF
export const EXPORT_KM_PATH_PDF = REPORT_KM_PATH + EXPORTS + EXPORT_PDF;


//  ------ VEHICLES ------ 
export const VEHICLES_PATH = VEHICLE
export const VEHICLES_MANAGE_PATH = VEHICLES_PATH + MANAGE
export const VEHICLES_CREATE_PATH = VEHICLES_PATH + CREATE
export const VEHICLES_EDIT_PATH = VEHICLES_PATH + EDIT

//  ------ GROUPS ------ 
export const GROUPS_PATH = GROUPS
export const GROUPS_MANAGE_PATH = GROUPS_PATH + MANAGE
export const GROUPS_CREATE_PATH = GROUPS_PATH + CREATE
export const GROUPS_EDIT_PATH = GROUPS_PATH + EDIT

//  ------ FENCES ------ 
export const FENCES_PATH = FENCES
export const FENCES_MANAGE_PATH = FENCES_PATH + MANAGE
export const FENCES_CREATE_PATH = FENCES_PATH + CREATE
export const FENCES_EDIT_PATH = FENCES_PATH + EDIT

//  ------ COMMANDS ------ 
export const COMMANDS_PATH = COMMANDS
export const COMMANDS_MANAGE_PATH = COMMANDS_PATH + MANAGE

//  ------ DRIVERS ------ 
export const DRIVERS_PATH = DRIVERS
export const DRIVERS_MANAGE_PATH = DRIVERS_PATH + MANAGE
export const DRIVERS_CREATE_PATH = DRIVERS_PATH + CREATE
export const DRIVERS_EDIT_PATH = DRIVERS_PATH + EDIT

//  ------ FUEL ------ 
export const FUEL_PATH = FUEL
export const FUEL_CREATE_PATH = FUEL_PATH + CREATE

//  ------ USERS ------ 
export const USERS_PATH = USERS
export const USERS_MANAGE_PATH = USERS_PATH + MANAGE
export const USERS_CREATE_PATH = USERS_PATH + CREATE
export const USERS_EDIT_PATH = USERS_PATH + EDIT

//  ------ CLIENTS ------ 
export const CLIENTS_PATH = CLIENTS
export const CLIENTS_MANAGE_PATH = LOGISTICS_SERVICES + CLIENTS_PATH + MANAGE
export const CLIENTS_CREATE_PATH = LOGISTICS_SERVICES + CLIENTS_PATH + CREATE
export const CLIENTS_EDIT_PATH = LOGISTICS_SERVICES + CLIENTS_PATH + EDIT

//  ------ PLACES ------ 
export const PLACES_PATH = PLACES
export const PLACES_MANAGE_PATH = LOGISTICS_SERVICES + PLACES_PATH + MANAGE
export const PLACES_CREATE_PATH = LOGISTICS_SERVICES + PLACES_PATH + CREATE
export const PLACES_EDIT_PATH = LOGISTICS_SERVICES + PLACES_PATH + EDIT

//  ------ FINANCIAL ------ 
export const FINANCIAL_PATH = FINANCIAL
export const FINANCIAL_MANAGE_PATH = FINANCIAL_PATH + MANAGE

// ------ LOGISTICS -------
export const LOGISTIC_PATH = LOGISTICS
export const LOGISTICS_SERVICES_PATH = LOGISTICS_SERVICES + LOGISTIC_PATH +MANAGE
export const LOGISTICS_SERVICES_EDIT_PATH = LOGISTICS_SERVICES + LOGISTIC_PATH + EDIT
export const LOGISTICS_SERVICES_CREATE_PATH = LOGISTICS_SERVICES + LOGISTIC_PATH + CREATE
//  ------ SOLICITATIONS ------ 
export const SOLICITATIONS_PATH = SOLICITATIONS
export const SOLICITATIONS_MANAGE_PATH = SOLICITATIONS_PATH + MANAGE
export const SOLICITATIONS_EDIT_PATH = SOLICITATIONS_PATH + EDIT

export const USAGE_ACHIEVEMENTS_PATH = USAGE_ACHIEVEMENT
