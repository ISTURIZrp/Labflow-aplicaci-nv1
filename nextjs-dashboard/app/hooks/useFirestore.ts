'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

// Interfaces basadas en la estructura de datos proporcionada
export interface Insumo {
  id?: string;
  created_at: string;
  existencia_total: number;
  id_original: string;
  nombre: string;
  stock_minimo: number;
}

export interface Lote {
  id?: string;
  created_at: string;
  existencia: number;
  fecha_caducidad: string;
  insumo_id: string;
  lote: string;
}

// Hook para obtener todos los insumos
export const useInsumos = () => {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(collection(db, 'insumos'), orderBy('nombre')),
      (querySnapshot) => {
        const insumosData: Insumo[] = [];
        querySnapshot.forEach((doc) => {
          insumosData.push({
            id: doc.id,
            ...doc.data()
          } as Insumo);
        });
        setInsumos(insumosData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching insumos:', error);

        // Mensajes de error más específicos
        let errorMessage = 'Error al cargar insumos';
        if (error.code === 'permission-denied') {
          errorMessage = 'Error de permisos: Revisa las reglas de Firestore. Ve a FIRESTORE_RULES.md para instrucciones.';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Firestore no disponible. Verifica tu conexión a internet.';
        } else if (error.code === 'unauthenticated') {
          errorMessage = 'Usuario no autenticado. Inicia sesión para acceder a los datos.';
        }

        setError(errorMessage);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { insumos, loading, error };
};

// Hook para obtener lotes de un insumo específico
export const useLotesByInsumo = (insumoId: string) => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !insumoId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'lotes'),
        where('insumo_id', '==', insumoId)
      ),
      (querySnapshot) => {
        const lotesData: Lote[] = [];
        querySnapshot.forEach((doc) => {
          lotesData.push({
            id: doc.id,
            ...doc.data()
          } as Lote);
        });
        // Sort by fecha_caducidad on client side to avoid Firebase composite index requirement
        lotesData.sort((a, b) => new Date(a.fecha_caducidad).getTime() - new Date(b.fecha_caducidad).getTime());
        setLotes(lotesData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching lotes:', error);

        // Mensajes de error más específicos
        let errorMessage = 'Error al cargar lotes';
        if (error.code === 'permission-denied') {
          errorMessage = 'Error de permisos: Revisa las reglas de Firestore. Ve a FIRESTORE_RULES.md para instrucciones.';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Firestore no disponible. Verifica tu conexión a internet.';
        } else if (error.code === 'unauthenticated') {
          errorMessage = 'Usuario no autenticado. Inicia sesión para acceder a los datos.';
        }

        setError(errorMessage);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [insumoId]);

  return { lotes, loading, error };
};

// Hook para obtener todos los lotes
export const useLotes = () => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'lotes'),
      (querySnapshot) => {
        const lotesData: Lote[] = [];
        querySnapshot.forEach((doc) => {
          lotesData.push({
            id: doc.id,
            ...doc.data()
          } as Lote);
        });
        // Sort by fecha_caducidad on client side to avoid Firebase index requirement
        lotesData.sort((a, b) => new Date(a.fecha_caducidad).getTime() - new Date(b.fecha_caducidad).getTime());
        setLotes(lotesData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching lotes:', error);

        // Mensajes de error más específicos
        let errorMessage = 'Error al cargar lotes';
        if (error.code === 'permission-denied') {
          errorMessage = 'Error de permisos: Revisa las reglas de Firestore. Ve a FIRESTORE_RULES.md para instrucciones.';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Firestore no disponible. Verifica tu conexión a internet.';
        } else if (error.code === 'unauthenticated') {
          errorMessage = 'Usuario no autenticado. Inicia sesión para acceder a los datos.';
        }

        setError(errorMessage);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { lotes, loading, error };
};

// Funciones CRUD para insumos
export const insumosAPI = {
  // Crear nuevo insumo
  async create(insumo: Omit<Insumo, 'id' | 'created_at'>) {
    if (!db) throw new Error('Firestore no está configurado');
    
    const docData = {
      ...insumo,
      created_at: new Date().toISOString()
    };
    
    return await addDoc(collection(db, 'insumos'), docData);
  },

  // Actualizar insumo
  async update(id: string, updates: Partial<Insumo>) {
    if (!db) throw new Error('Firestore no está configurado');
    
    const docRef = doc(db, 'insumos', id);
    return await updateDoc(docRef, updates);
  },

  // Eliminar insumo
  async delete(id: string) {
    if (!db) throw new Error('Firestore no está configurado');
    
    const docRef = doc(db, 'insumos', id);
    return await deleteDoc(docRef);
  },

  // Obtener un insumo por ID
  async getById(id: string) {
    if (!db) throw new Error('Firestore no está configurado');
    
    const docRef = doc(db, 'insumos', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Insumo;
    }
    return null;
  }
};

// Funciones CRUD para lotes
export const lotesAPI = {
  // Crear nuevo lote
  async create(lote: Omit<Lote, 'id' | 'created_at'>) {
    if (!db) throw new Error('Firestore no está configurado');
    
    const docData = {
      ...lote,
      created_at: new Date().toISOString()
    };
    
    return await addDoc(collection(db, 'lotes'), docData);
  },

  // Actualizar lote
  async update(id: string, updates: Partial<Lote>) {
    if (!db) throw new Error('Firestore no está configurado');
    
    const docRef = doc(db, 'lotes', id);
    return await updateDoc(docRef, updates);
  },

  // Eliminar lote
  async delete(id: string) {
    if (!db) throw new Error('Firestore no está configurado');
    
    const docRef = doc(db, 'lotes', id);
    return await deleteDoc(docRef);
  },

  // Obtener lotes por insumo
  async getByInsumoId(insumoId: string) {
    if (!db) throw new Error('Firestore no está configurado');
    
    const q = query(
      collection(db, 'lotes'),
      where('insumo_id', '==', insumoId)
    );
    
    const querySnapshot = await getDocs(q);
    const lotes: Lote[] = [];
    
    querySnapshot.forEach((doc) => {
      lotes.push({ id: doc.id, ...doc.data() } as Lote);
    });

    // Sort by fecha_caducidad on client side to avoid Firebase composite index requirement
    lotes.sort((a, b) => new Date(a.fecha_caducidad).getTime() - new Date(b.fecha_caducidad).getTime());

    return lotes;
  }
};

// Función helper para calcular el estado del stock
export const getStockStatus = (existencia: number, stockMinimo: number) => {
  if (existencia === 0) return 'Agotado';
  if (existencia <= stockMinimo) return 'Crítico';
  if (existencia <= stockMinimo * 2) return 'Bajo Stock';
  return 'Disponible';
};

// Función helper para calcular días hasta caducidad
export const getDaysUntilExpiration = (fechaCaducidad: string) => {
  const today = new Date();
  const expDate = new Date(fechaCaducidad);
  const timeDiff = expDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
