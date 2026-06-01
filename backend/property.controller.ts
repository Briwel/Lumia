
import { Controller, Get, Post, Body, Param, Put, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property, Operation } from './entities';

@Controller('properties')
export class PropertyController {
  constructor(
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
  ) {}

  @Get()
  async findAll() {
    // On ne retourne que les biens disponibles pour le public
    return this.propertyRepo.find({ 
      where: { status: 'available' },
      order: { createdAt: 'DESC' } 
    });
  }

  @Post()
  async create(@Body() data: any) {
    const property = this.propertyRepo.create(data);
    return this.propertyRepo.save(property);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.propertyRepo.findOne({ where: { id } });
  }
}

@Controller('operations')
export class OperationController {
  constructor(
    @InjectRepository(Operation)
    private opRepo: Repository<Operation>,
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
  ) {}

  @Get()
  async findAll() {
    return this.opRepo.find({ relations: ['property', 'client'], order: { date: 'DESC' } });
  }

  @Post()
  async create(@Body() data: { propertyId: string, clientId: string, amount: number, type: 'sale' | 'rent' }) {
    const property = await this.propertyRepo.findOne({ where: { id: data.propertyId } });
    if (!property) throw new NotFoundException('Bien non trouvé');

    // 1. Créer l'opération
    const operation = this.opRepo.create({
      transactionType: data.type,
      amount: data.amount,
      property: property,
      // agent et client seraient gérés via les relations réelles ici
      date: new Date()
    });

    // 2. Mettre à jour le statut du bien
    property.status = 'sold';
    await this.propertyRepo.save(property);

    return this.opRepo.save(operation);
  }
}

@Controller('agent/properties')
export class AgentPropertyController {
  constructor(
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
  ) {}

  @Get()
  async findMyProperties() {
    // L'agent voit tous ses biens, même vendus
    return this.propertyRepo.find({ order: { createdAt: 'DESC' } });
  }
}
