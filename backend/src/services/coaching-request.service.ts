import CoachingRequest, { CoachingRequestType } from '../models/coaching-request.model';

export const getAllCoachingRequests = async (): Promise<CoachingRequestType[]> => {
  try {
    return await CoachingRequest.findAll();
  } catch (error) {
    console.error('Error fetching coaching requests:', error);
    throw new Error('An error occurred while fetching coaching requests');
  }
};

export const getCoachingRequestById = async (id: string): Promise<CoachingRequestType> => {
  try {
    const request = await CoachingRequest.findByPk(id);
    if (!request) {
      throw new Error('Coaching request not found');
    }
    return request;
  } catch (error) {
    console.error(`Error fetching coaching request with id ${id}:`, error);
    throw new Error('An error occurred while fetching the coaching request');
  }
};

export const createCoachingRequest = async (
  full_name: string,
  email: string,
  coaching_type: 'one_to_one' | 'e_coaching',
  user_id?: string,
  phone?: string,
  availability?: string,
  message?: string,
  status?: 'new' | 'in_progress' | 'completed' | 'rejected'
): Promise<CoachingRequestType> => {
  try {
    return await CoachingRequest.create({
      user_id,
      full_name,
      email,
      phone,
      coaching_type,
      availability,
      message,
      status,
    });
  } catch (error) {
    console.error('Error creating coaching request:', error);
    throw new Error('An error occurred while creating the coaching request');
  }
};

export const updateCoachingRequest = async (
  id: string,
  fields: Partial<CoachingRequestType>
): Promise<CoachingRequestType> => {
  try {
    const request = await CoachingRequest.findByPk(id);
    if (!request) {
      throw new Error('Coaching request not found');
    }
    request.user_id = fields.user_id ?? request.user_id;
    request.full_name = fields.full_name ?? request.full_name;
    request.email = fields.email ?? request.email;
    request.phone = fields.phone ?? request.phone;
    request.coaching_type = fields.coaching_type ?? request.coaching_type;
    request.availability = fields.availability ?? request.availability;
    request.message = fields.message ?? request.message;
    request.status = fields.status ?? request.status;
    return await CoachingRequest.save(request);
  } catch (error) {
    console.error(`Error updating coaching request with id ${id}:`, error);
    throw new Error('An error occurred while updating the coaching request');
  }
};

export const deleteCoachingRequest = async (id: string): Promise<void> => {
  try {
    await CoachingRequest.destroy(id);
  } catch (error) {
    console.error(`Error deleting coaching request with id ${id}:`, error);
    throw new Error('An error occurred while deleting the coaching request');
  }
};