import dns from 'node:dns'
import process from 'node:process'
import mongoose from 'mongoose'

export async function connectDatabase() {
  // Set public DNS servers to resolve MongoDB SRV records on networks/ISPs with faulty DNS resolvers
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
  } catch (dnsError) {
    console.warn('Failed to set public DNS servers, falling back to system defaults:', dnsError.message)
  }

  const uri = process.env.MONGODB_URI || "mongodb+srv://healthcare:CRnMHrmnRWUijjGw@helthcare.zj9mtxl.mongodb.net/healthcare?appName=helthcare"

  if (!uri) {
    throw new Error('MONGODB_URI is missing')
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  return mongoose.connection
}
