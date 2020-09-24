import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {Platform, Alert} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimerPicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import api from '../../services/api';
import {Provider} from '../Dashboard';
import {useAuth} from '../../hooks/auth';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  Content,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
  providerId: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const {providerId} = route.params as RouteParams;

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);

  const {user} = useAuth();
  const {goBack, navigate} = useNavigation();

  useEffect(() => {
    api.get('providers').then((res) => {
      setProviders(res.data);
    });
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((res) => {
        setAvailability(res.data);
      });
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((selectedId: string) => {
    setSelectedProvider(selectedId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', {date: date.getTime()});
    } catch (error) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro, tente novamente',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({hour}) => hour < 12)
      .map(({hour, available}) => ({
        hour,
        available,
        formattedHour: format(new Date().setHours(hour), 'HH:00'),
      }));
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({hour}) => hour >= 12)
      .map(({hour, available}) => ({
        hour,
        available,
        formattedHour: format(new Date().setHours(hour), 'HH:00'),
      }));
  }, [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{uri: user.avatar_url}} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={(provider) => provider.id}
            renderItem={({item: provider}) => (
              <ProviderContainer
                onPress={() => {
                  handleSelectProvider(provider.id);
                }}
                selected={provider.id === selectedProvider}>
                {provider.avatar_url ? (
                  <ProviderAvatar source={{uri: provider.avatar_url}} />
                ) : (
                  <Icon
                    name="user"
                    size={32}
                    color={
                      provider.id === selectedProvider ? '#111' : '#f4ede8'
                    }
                  />
                )}
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimerPicker
              mode="date"
              display="calendar"
              value={selectedDate}
              onChange={handleDateChange}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({hour, formattedHour, available}) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  onPress={() => handleSelectHour(hour)}
                  available={available}
                  key={formattedHour}>
                  <HourText selected={selectedHour === hour}>
                    {formattedHour}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(({hour, formattedHour, available}) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  onPress={() => handleSelectHour(hour)}
                  available={available}
                  key={formattedHour}>
                  <HourText selected={selectedHour === hour}>
                    {formattedHour}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
